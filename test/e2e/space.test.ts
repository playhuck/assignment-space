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
import { CustomException } from '@common/exception/custom.exception';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { PostSpaceJoinDto } from '@dtos/spaces/post.space.join.dto';
import { UserRepository } from '@repositories/user.repository';
import { SpaceRole } from '@entities/space.role.entity';
import { SpaceUserRole } from '@entities/space.user.role.entity';
import { Space } from '@entities/space.entity';
import { SpaceRoleCode } from '@entities/space.role.code.entity';

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
    const targetJoinerUserId = 3;
    let targetSpaceId: number;
    let scenarioSpaceId: number;
    let targetOwnerSpaceRoleId: number;
    let scenarioSpaceRoleId:number;
    let scenarioJoinerSpaceRoleId:number;
    let scenarioDeleteSpaceRoldId:number;

    let currTime: string;
    let accessToken: string;
    let secondAccessToken: string;
    let joinerAccessToken: string;

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


        const noJoin = await entityManager.insert(User, {
            userId: targetJoinerUserId,
            ...userDto.signUp()
        });

        expect(noJoin.generatedMaps.length).toBe(1);

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

        expect(secondOwnerToken).toBeTruthy();

        const noJoinerToken = jwt.signAccessToken({
            userId: targetJoinerUserId,
            type: 'AccessToken'
        });

        expect(noJoinerToken).toBeTruthy();

        accessToken = ownerToken;
        secondAccessToken = secondOwnerToken;
        joinerAccessToken = noJoinerToken;

    });

    describe("공간 생성, POST /space", () => {

        it('영문 + 숫자의 조합 8자리', async () => {

            const randomValue = await random.generateRandomString(8);
            const regex = new RegExp(/^[a-zA-Z0-9]{8}$/).test(randomValue);

            expect(regex).toBeTruthy();

        });

        it('역할 권한 확인 CASE 1: admin', async () => {

            const type = service.getRoleType('admin');

            Object.keys(type).map((key, i) => {

                expect(type[key]).toBe(1);

            })
        });

        it('역할 권한 확인 CASE 2: joiner', async () => {

            const type = service.getRoleType('joiner');

            Object.keys(type).map((key, i) => {

                expect(type[key]).toBe(0);

            });

        });

        it('역할 권한 확인 CASE 3: custom', async () => {

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

        it('공간 생성', async () => {

            const insert: InsertResult = await spaceRepo.insertSpace(
                entityManager,
                {
                    spaceLogo: 'image',
                    spaceName: 'hello'
                },
                currTime,
                targetUserId
            );

            expect(insert.generatedMaps.length).toBe(1);
            expect(insert?.raw?.insertId).toBeTruthy();

            targetSpaceId = insert?.raw?.insertId

        });

        it('소유자 역할 생성', async () => {

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

        it('소유자의 유저 역할 생성', async () => {

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

        it('그 외 역할 생성', async () => {

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

        it('시나리오 : 공간 생성', async () => {

            const send: PostSpaceDto = await spaceDto.postSpace('TEST_SPACE');

            await req
                .post('/space')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(send)
                .then(async (res) => {

                    const { body }: {
                        body: {
                            getPresignedUrl: string
                        }
                    } = res;

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
                    
                    const getSpaceRoleList = await spaceRepo.getSpaceRoleListBySpaceId(scenarioSpaceId);

                    expect(getSpaceRoleList.length).toBe(6);
                    
                    scenarioSpaceRoleId = getSpaceRoleList[1].spaceRoleId;
                    scenarioJoinerSpaceRoleId = getSpaceRoleList[2].spaceRoleId;
                    scenarioDeleteSpaceRoldId = getSpaceRoleList[3].spaceRoleId;

                })

        })

    });

    describe("공간 참여", () => {

        it('유효하지 않은 코드', async() => {

            try {
                await controller.postSpaceJoin(
                    {
                        userId: targetUserId,
                        email: ' ',
                        createdAt: ' ',
                        firstName: ' ',
                        lastName: ' ',
                        profileImage: ' '
                    },
                    {
                        spaceId: scenarioSpaceId
                    },
                    {
                        joinCode: '00'
                    }
                );
            } catch (e) {

                if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['SPACE-002']);
                if (e instanceof CustomException) expect(e['statusCode']).toBe(400);
                
            }
        });

        /** 유저의 참여는 위에서 테스트 완료 */
        it('시나리오 : 공간 참여 Admin', async() => {

            const spaceRole = await spaceRepo.getSpaceRoleCodeByRoleId(scenarioSpaceRoleId);

            expect(spaceRole).toBeTruthy();

            const send : PostSpaceJoinDto = {
                joinCode: spaceRole?.code!
            };

            await req
                .post(`/space/${scenarioSpaceId}/join`)
                .set('Authorization', `Bearer ${secondAccessToken}`)
                .send(send)
                .then(async() => {

                    const spaceUserRole = await spaceRepo.getSpaceUserRoleByUserId(
                        targetSecondUserId
                    );

                    expect(spaceUserRole).toBeTruthy();

                });
        });

        it('시나리오 : 공간 참여 Joiner', async() => {

            const spaceRole = await spaceRepo.getSpaceRoleCodeByRoleId(scenarioJoinerSpaceRoleId);

            expect(spaceRole).toBeTruthy();

            const send : PostSpaceJoinDto = {
                joinCode: spaceRole?.code!
            };

            await req
                .post(`/space/${scenarioSpaceId}/join`)
                .set('Authorization', `Bearer ${joinerAccessToken}`)
                .send(send)
                .then(async() => {
                    
                    const spaceUserRole = await spaceRepo.getSpaceUserRoleByUserId(
                        targetJoinerUserId
                    );

                    expect(spaceUserRole).toBeTruthy();

                });
        })
        
    });

    describe("권한", () => {

        it('공간에 참여 필요', async () => {

            const insert = await entityManager.insert(User, {
                userId: 4,
                ...userDto.signUp()
            });

            expect(insert.generatedMaps.length).toBe(1);

            const dummyToken = jwt.signAccessToken({
                userId: 4,
                type: 'AccessToken'
            });

            await req
                .patch(`/space/owner/${scenarioSpaceId}`)
                .set('Authorization', `Bearer ${dummyToken}`)
                .query(query)
                .then((res) => {

                    const { body } = res;

                    expect(body['message']).toBe('잘못된 요청(공간 참여자가 아님)');
                    expect(body['statusCode']).toBe(403);

                })

        });

        it('소유자만 사용할 수 없음', async () => {

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

        it('참여자는 사용할 수 없음', async () => {

            await req
                .delete(`/space/admin/${scenarioSpaceId}/${scenarioSpaceRoleId}`)
                .set('Authorization', `Bearer ${joinerAccessToken}`)
                .query(query)
                .then((res) => {

                    const { body } = res;

                    expect(body['message']).toBe('일반 참여자는 사용할 수 없습니다.');
                    expect(body['statusCode']).toBe(401)

                })

        });

    });

    describe("공간 삭제", () => {

        describe("역할 삭제, DELETE /space/admin/:spaceId/:spaceRoleid", () => {

            it('사용중인 역할', async () => {

                try {

                    await controller.deleteSpaceRole({
                        spaceId: scenarioSpaceId,
                        spaceRoleId: scenarioDeleteSpaceRoldId
                    });

                } catch (e) {

                    if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['ROLE-002']);
                    if (e instanceof CustomException) expect(e['statusCode']).toBe(400);

                }

            });

            it('시나리오 : 역할 삭제', async () => {

                const isUsedSpaceRoleSpyOn = jest.spyOn(SpaceRepository.prototype, 'getSpaceUserRoleBySpaceRoleId')
                    .mockResolvedValue(new SpaceUserRole())

                await req
                    .delete(`/space/admin/${scenarioSpaceId}/${scenarioDeleteSpaceRoldId}`)
                    .set('Authorization', `Bearer ${secondAccessToken}`)
                    .query(query)
                    .then(async() => {

                        const getDeletedSpaceRole = await spaceRepo.getSpaceRoleBySpaceRoleId(scenarioDeleteSpaceRoldId);
                        expect(getDeletedSpaceRole).toBeFalsy();

                        const getDeletedSpaceRoleWithDeleted = await entityManager.findOne(SpaceRole, {
                            where: {
                                spaceRoleId: scenarioDeleteSpaceRoldId
                            },
                            withDeleted: true
                        });
                        expect(getDeletedSpaceRoleWithDeleted).toBeTruthy();

                        expect(isUsedSpaceRoleSpyOn).toHaveBeenCalledTimes(1);

                    });

            });

        });

        describe("공간 삭제, DELETE /space/owner/:spaceId", () => {

            it('시나리오 : 공간 삭제', async () => {

                await req
                    .delete(`/space/owner/${scenarioSpaceId}`)
                    .set('Authorization', `Bearer ${accessToken}`)
                    .query(query)
                    .then(async () => {

                        const deletedSpace = await spaceRepo.getSpaceById(scenarioSpaceId);
                        const withDeletedSpace = await entityManager.findOne(Space, {
                            where: {
                                spaceId: scenarioSpaceId
                            },
                            withDeleted: true
                        });
                        expect(deletedSpace).toBeFalsy();
                        expect(withDeletedSpace).toBeTruthy();

                        const deletedSpaceRole = await spaceRepo.getSpaceRoleListBySpaceId(scenarioSpaceId);
                        const withDeletedSpaceRole = await entityManager.find(SpaceRole, {
                            where: {
                                spaceId: scenarioSpaceId
                            },
                            withDeleted: true
                        });
                        expect(deletedSpaceRole.length).toBe(0);
                        expect(withDeletedSpaceRole.length).toBeGreaterThanOrEqual(1);

                        const deletedSpaceUserRoleList = await spaceRepo.getSpaceUserRoleListBySpaceId(scenarioSpaceId);
                        const withDeletedSpaceUserRoleList = await entityManager.find(SpaceUserRole, {
                            where: {
                                spaceId: scenarioSpaceId
                            },
                            withDeleted: true
                        });
                        expect(deletedSpaceUserRoleList.length).toBe(0);
                        expect(withDeletedSpaceUserRoleList.length).toBeGreaterThanOrEqual(1);


                    })

            });

        });

    });

    afterAll(async () => {

        await app.close();
        jest.resetAllMocks();

    });

    afterEach(() => {

        jest.clearAllMocks();
        jest.restoreAllMocks();

    });
})