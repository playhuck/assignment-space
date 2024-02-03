import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager, InsertResult } from 'typeorm';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

import { SpaceController } from '@controllers/space.controller';

import { SpaceService } from '@services/space.service';

import { JwtProvider } from '@providers/jwt.provider';
import { BcryptProvider } from '@providers/bcrypt.provider';
import { DayjsProvider } from '@providers/dayjs.provider';
import { RandomProvider } from '@providers/random.provider';


import { SpaceRepository } from '@repositories/space.repository';

import { UserDtoFixture } from '../_.fake.datas/dtos/user.dto.fixture';
import { SpaceDtoFixture } from '../_.fake.datas/dtos/space.dto.fixture';

import { User } from '@entities/user.entity';
import { PostSpaceDto } from '@dtos/spaces/post.space.dto';
import { ADMIN } from '@common/constants/role.constant';

jest.mock('@aws-sdk/s3-request-presigner', () => ({
    getSignedUrl: jest.fn(() => {

        return 'hello';
    }),
}));

jest.mock('@aws-sdk/client-s3', () => ({
    S3Client: jest.fn(() => ({
        send: jest.fn(),
    })),
    PutObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
}));

describe('Space Test', () => {

    let app: INestApplication;
    let config: ConfigService;
    let dataSource: DataSource;
    let entityManager: EntityManager;

    let service: SpaceService;
    let controller: SpaceController;
    let spaceRepo: SpaceRepository;

    let bcrypt: BcryptProvider;
    let jwt: JwtProvider;
    let dayjs: DayjsProvider;
    let random: RandomProvider

    let userDto: UserDtoFixture;
    let spaceDto: SpaceDtoFixture;

    let req: request.SuperTest<request.Test>;

    const query = {
        isTest: true
    }

    const targetUserId = 1;
    const targetSecondUserId = 2;
    let targetSpaceId: number;
    let scenarioSpaceId: number;
    let targetOwnerSpaceRoleId: number;

    let currTime: string;
    let accessToken: string;
    let secondAccessToken: string;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                AppModule
            ],
            providers: [
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {

                            if (key === 'SALT') return 10;

                            return undefined;
                        })
                    }
                }
            ]
        }).compile();

        app = module.createNestApplication();
        await app.init();

        config = module.get<ConfigService>(ConfigService);
        dataSource = module.get<DataSource>(DataSource);

        controller = module.get<SpaceController>(SpaceController);
        service = module.get<SpaceService>(SpaceService);
        spaceRepo = module.get<SpaceRepository>(SpaceRepository);

        bcrypt = module.get<BcryptProvider>(BcryptProvider);
        jwt = module.get<JwtProvider>(JwtProvider);
        dayjs = module.get<DayjsProvider>(DayjsProvider);
        random = module.get<RandomProvider>(RandomProvider);

        entityManager = dataSource.createEntityManager();

        req = request(app.getHttpServer());

        userDto = new UserDtoFixture();
        spaceDto = new SpaceDtoFixture();

        currTime = dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

        const originOwner = await entityManager.insert(User, {
            userId: targetUserId,
            ...userDto.signUp()
        });

        expect(originOwner.generatedMaps.length).toBe(1);

        const secondOwner = await entityManager.insert(User, {
            userId: targetSecondUserId,
            ...userDto.signUp()
        });

        expect(secondOwner.generatedMaps.length).toBe(1);

    });

    it('SpaceService Property Should Be Define', async () => {

        expect(service['dayjs']).toBeDefined();
        expect(service['db']).toBeDefined();
        expect(service['random']).toBeDefined();
        expect(service['s3']).toBeDefined();
        expect(service['spaceRepo']).toBeDefined();

        expect(controller['service']).toBeDefined();

    });

    it('access token 발급', async() => {

        const ownerToken = jwt.signAccessToken({
            userId: targetUserId,
            type: 'AccessToken'
        });

        expect(ownerToken).toBeTruthy();

        const secondOwnerToken = jwt.signAccessToken({
            userId: targetSecondUserId,
            type: 'AccessToken'
        });

        accessToken = ownerToken;
        secondAccessToken = secondOwnerToken;

    });

    describe("공간 생성, POST /space", () => {
        

        it('영문 + 숫자의 조합 8자리', async() => {
        
            const randomValue = await random.generateRandomString(8);
            const regex = new RegExp(/^[a-zA-Z0-9]{8}$/).test(randomValue);
    
            expect(regex).toBeTruthy();
           
        });

        it('역할 권한 확인 CASE 1: admin', async() => {

            const type = service.getRoleType('admin');

            Object.keys(type).map((key, i) => {

                expect(type[key]).toBe(1);
                
            })
        });

        it('역할 권한 확인 CASE 2: joiner', async() => {

            const type = service.getRoleType('joiner');

            Object.keys(type).map((key, i) => {

                expect(type[key]).toBe(0);
                
            });

        });

        it('역할 권한 확인 CASE 3: custom', async() => {

            const type = service.getRoleType('custom', {
                spaceChatAdminDelete: 1,
                spaceForcedExit: 0,
                spacePostAdminDelete: 0,
                spacePostNotice: 1,
                spaceRoleDelete: 0
            });

            Object.keys(type).map((key, i) => {

                expect(type['spaceChatAdminDelete']).toBe(1);
                expect(type['spaceForcedExit']).toBe(0);
                expect(type['spacePostAdminDelete']).toBe(0);
                expect(type['spacePostNotice']).toBe(1);
                expect(type['spaceRoleDelete']).toBe(0);
                
            });

        });

        it('공간 생성', async() => {

            const adminCode = await random.generateRandomString(8);
            const joinerCode = await random.generateRandomString(8);

            const insert : InsertResult = await spaceRepo.insertSpace(
                entityManager,
                {
                    spaceLogo: 'image',
                    spaceName: 'hello'
                },
                currTime,
                targetUserId,
                adminCode,
                joinerCode
            );

            expect(insert.generatedMaps.length).toBe(1);
            expect(insert?.raw?.insertId).toBeTruthy();

            targetSpaceId = insert?.raw?.insertId

        });

        it('소유자 역할 생성', async() => {

            const insert = await spaceRepo.insertOwnerSpaceRole(
                entityManager,
                targetSpaceId,
                'ownerRole',
                currTime
            );

            expect(insert.generatedMaps.length).toBe(1);
            expect(insert.raw.insertId).toBeTruthy();

            targetOwnerSpaceRoleId = insert.raw.insertId;

            const getOwnerSpaceRole = await spaceRepo.getSpaceRoleBySpaceRoleId(insert.raw.insertId);

            expect(getOwnerSpaceRole).toBeTruthy();
            expect(getOwnerSpaceRole?.roleLevel).toBe('owner');
            expect(getOwnerSpaceRole?.roleName).toBe('ownerRole');
            expect(getOwnerSpaceRole?.spaceOwnerAssign).toBe(1);
        });

        it('소유자의 유저 역할 생성', async() => {

            const insert = await spaceRepo.insertSpaceUserRole(
                entityManager,
                targetSpaceId,
                targetUserId,
                targetOwnerSpaceRoleId,
                currTime
            );

            expect(insert.generatedMaps.length).toBe(1);
            expect(insert.raw.insertId).toBeTruthy();

            const getOwnerSpaceRole = await spaceRepo.getSpaceUserRoleByIds(
                targetSpaceId,
                targetUserId,
                targetOwnerSpaceRoleId
            );

            expect(getOwnerSpaceRole).toBeTruthy();

        });

        it('그 외 역할 생성', async() => {

            const insert = await spaceRepo.insertSpaceRole(
                entityManager,
                targetSpaceId,
                'adminRole',
                'admin',
                currTime,
                ADMIN
            );

            expect(insert.generatedMaps.length).toBe(1);
            expect(insert.raw.insertId).toBeTruthy();

            const getSpaceRole = await spaceRepo.getSpaceRoleBySpaceRoleId(insert.raw.insertId);

            expect(getSpaceRole).toBeTruthy();
            expect(getSpaceRole?.roleLevel).toBe('admin');
            expect(getSpaceRole?.roleName).toBe('adminRole');
            expect(getSpaceRole?.spaceOwnerAssign).toBe(0);

        });

        it('시나리오 : 공간 생성', async() => {
            
            const adminCode = await random.generateRandomString(8);
            const joinerCode = await random.generateRandomString(8);
            const send : PostSpaceDto = await spaceDto.postSpace('TEST_SPACE');
            const adminCodeSpyOn = jest.spyOn(RandomProvider.prototype, 'generateRandomString').mockResolvedValue(adminCode);
            adminCodeSpyOn.mockRestore();

            jest.spyOn(RandomProvider.prototype, 'generateRandomString').mockResolvedValue(joinerCode);

            await req
                .post('/space')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(send)
                .then(async(res) => {

                    const { body } : {
                        body : {
                            getPresignedUrl: string
                        }
                    }= res;
                    
                    expect(body.getPresignedUrl).toBe('hello');

                    const getSpaceUserRoleByUserId = await spaceRepo.getSpaceUserRoleByUserId(targetUserId);
                    expect(getSpaceUserRoleByUserId.length).toBe(2);

                    const getUserSpaceRelation = await spaceRepo.getUserSpaceRelation(
                        getSpaceUserRoleByUserId[0].spaceId,
                        getSpaceUserRoleByUserId[0].userId
                    );
                    expect(getUserSpaceRelation?.space.spaceName).toBe('TEST_SPACE');
                    expect(getUserSpaceRelation?.spaceRole.roleName).toBe('head');
                    expect(getUserSpaceRelation?.spaceRole.roleLevel).toBe('owner');

                    scenarioSpaceId = getSpaceUserRoleByUserId[0].spaceId;

                })

        })

    });

    describe("권한", () => {

        it('공간 수정은 OWNER만 가능', async () => {

            await req
                .patch(`/space/owner/${scenarioSpaceId}`)
                .set('Authorization', `Bearer ${secondAccessToken}`)
                .query(query)
                .then((res) => {

                    const { body } = res;

                    expect(body['message']).toBe('소유자만 이용할 수 있습니다.');
                    expect(body['statusCode']).toBe(401)

                })

        });

    });

    // describe("공간 수정", () => {

    //     describe("공간 이름 및 로고 수정", () => {

            
    //     })
    // })

    afterAll(async () => {

        await app.close();
        jest.resetAllMocks();

    });

    afterEach(() => {

        jest.clearAllMocks();
        jest.restoreAllMocks();

    });
})