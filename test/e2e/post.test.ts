import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';
import request from 'supertest';

import { AppModule } from '../../src/app.module';

import { JwtProvider } from '@providers/jwt.provider';
import { BcryptProvider } from '@providers/bcrypt.provider';
import { DayjsProvider } from '@providers/dayjs.provider';
import { RandomProvider } from '@providers/random.provider';


import { SpaceRepository } from '@repositories/space.repository';

import { UserDtoFixture } from '../_.fake.datas/dtos/user.dto.fixture';
import { SpaceDtoFixture } from '../_.fake.datas/dtos/space.dto.fixture';
import { PostDtoFixture } from '../_.fake.datas/dtos/post.dto.fixture';

import { PostController } from '@controllers/post.controller';
import { PostService } from '@services/post.service';

import { PostRepository } from '@repositories/post.repository';

import { CustomException } from '@common/exception/custom.exception';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';

import { User } from '@entities/user.entity';
import { IUser } from '@models/interfaces/i.user';
import { SpaceParamDto } from '@dtos/spaces/space.param.dto';
import { PostPostDto } from '@dtos/posts/post.post.dto';
import { PostSpaceJoinDto } from '@dtos/spaces/post.space.join.dto';

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
    GetObjectCommand: jest.fn()
}));

describe('Space Test', () => {

    let app: INestApplication;
    let config: ConfigService;
    let dataSource: DataSource;
    let entityManager: EntityManager;

    let service: PostService;
    let controller: PostController;
    let spaceRepo: SpaceRepository;
    let postRepo: PostRepository;

    let bcrypt: BcryptProvider;
    let jwt: JwtProvider;
    let dayjs: DayjsProvider;
    let random: RandomProvider

    let userDto: UserDtoFixture;
    let spaceDto: SpaceDtoFixture;
    let postDto: PostDtoFixture;

    let req: request.SuperTest<request.Test>;

    const query = {
        isTest: true
    };
    const ownerUserId = 4;
    const adminUserId = 5;
    const joinerUserId = 6;
    let ownerAccessToken: string;
    let adminAccessToken: string;
    let joinerAccessToken: string;

    let targetSpaceId: number;
    let targetAdminCode: string;
    let targetJoinerCode: string;

    let currTime: string;

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

        controller = module.get<PostController>(PostController);
        service = module.get<PostService>(PostService);
        spaceRepo = module.get<SpaceRepository>(SpaceRepository);
        postRepo = module.get<PostRepository>(PostRepository);

        bcrypt = module.get<BcryptProvider>(BcryptProvider);
        jwt = module.get<JwtProvider>(JwtProvider);
        dayjs = module.get<DayjsProvider>(DayjsProvider);
        random = module.get<RandomProvider>(RandomProvider);

        entityManager = dataSource.createEntityManager();

        req = request(app.getHttpServer());

        userDto = new UserDtoFixture();
        spaceDto = new SpaceDtoFixture();
        postDto = new PostDtoFixture();

        currTime = dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss');

        const originOwner = await entityManager.insert(User, {
            userId: ownerUserId,
            ...userDto.signUp()
        });

        expect(originOwner.generatedMaps.length).toBe(1);

        const originAdmin = await entityManager.insert(User, {
            userId: adminUserId,
            ...userDto.signUp()
        });

        expect(originAdmin.generatedMaps.length).toBe(1);

        const originJoiner = await entityManager.insert(User, {
            userId: joinerUserId,
            ...userDto.signUp()
        });

        expect(originJoiner.generatedMaps.length).toBe(1);


    });

    it('PostService Property Should Be Define', async () => {

        expect(service['dayjs']).toBeDefined();
        expect(service['db']).toBeDefined();
        expect(service['s3']).toBeDefined();
        expect(service['spaceRepo']).toBeDefined();
        expect(service['postRepo']).toBeDefined();

        expect(controller['service']).toBeDefined();

    });

    it('access token 발급', async () => {

        const ownerToken = jwt.signAccessToken({
            userId: ownerUserId,
            type: 'AccessToken'
        });

        expect(ownerToken).toBeTruthy();

        const adminToken = jwt.signAccessToken({
            userId: adminUserId,
            type: 'AccessToken'
        });

        expect(adminToken).toBeTruthy();

        const joinerToken = jwt.signAccessToken({
            userId: joinerUserId,
            type: 'AccessToken'
        });

        expect(joinerToken).toBeTruthy();

        ownerAccessToken = ownerToken;
        adminAccessToken = adminToken;
        joinerAccessToken = joinerToken;

    });

    describe("공간 기본 값 생성", () => {

        it('공간 생성', async() => {

            const send = await spaceDto.postSpaceQuestion('POST_TEST'); 
            await req
                .post('/space')
                .set('Authorization', `Bearer ${ownerAccessToken}`)
                .query(query)
                .send(send)
                .then(async(res) => {
    
                    const { body } = res;
    
                    expect(body?.getPresignedUrl).toBeTruthy();
    
                    const space = await spaceRepo.getSpaceUserRoleByUserId(
                        ownerUserId,
                        0,
                        15,
                        'DESC'
                        );
                    expect(space.length).toBeGreaterThanOrEqual(1);
                        
                    targetSpaceId = space[0].spaceId
                    
                    const adminUserRole = await spaceRepo.getSpaceRoleListBySpaceId(
                        targetSpaceId
                    );

                    const adminCode = await spaceRepo.getSpaceRoleCodeByRoleId(adminUserRole[1].spaceRoleId);
                    const joinerCode = await spaceRepo.getSpaceRoleCodeByRoleId(adminUserRole[2].spaceRoleId);

                    targetAdminCode = adminCode?.code!;
                    targetJoinerCode = joinerCode?.code!;
                });
        });

        it('공간 참여 : admin', async() => {

            const send : PostSpaceJoinDto = {
                joinCode: targetAdminCode
            };

            await req
                .post(`/space/${targetSpaceId}/join`)
                .set('Authorization', `Bearer ${adminAccessToken}`)
                .query(query)
                .send(send)
            
        });

        it('공간 참여 : joiner', async() => {

            const send : PostSpaceJoinDto = {
                joinCode: targetJoinerCode
            };

            await req
                .post(`/space/${targetSpaceId}/join`)
                .set('Authorization', `Bearer ${joinerAccessToken}`)
                .query(query)
                .send(send)

        });

    })

    describe("게시글 작성", () => {

        describe("질문 작성, POST /space/:spaceId/post/question", () => {

            let user: IUser;
            let param: SpaceParamDto;
            let body : PostPostDto;

            beforeAll(async() => {

                user = {
                    userId: adminUserId,
                    email: ' ',
                    firstName: ' ',
                    lastName: ' ',
                    createdAt: ' ',
                    profileImage: ' '
                };

                param = {
                    spaceId: targetSpaceId
                };

                body = await postDto.postDto(
                    'POST_TEST_QUESTION',
                    true,
                    'notice'
                );
            });

            it('잘못된 게시글 카테고리', async() => {
                
                try {

                    await controller.postQuestion(
                        user,
                        param,
                        body
                    );
                    
                } catch (e) {
    
                    if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['POST-002']);
                    if (e instanceof CustomException) expect(e['statusCode']).toBe(400);
    
                }

            });

            it('참여자만 익명으로 작성 가능', async() => {

                body.postCategory = 'question';

                try {

                    await controller.postQuestion(
                        user,
                        param,
                        body
                    );
                    
                } catch (e) {
    
                    if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['ROLE-005']);
                    if (e instanceof CustomException) expect(e['statusCode']).toBe(401);
    
                }

            });

            it('시나리오 : 익명 질문 작성', async() => {

                await req
                    .post(`/space/${targetSpaceId}/post/question`)
                    .set('Authorization', `Bearer ${joinerAccessToken}`)
                    .send(body)
                    .then(async(res) => {

                        const { body } : {
                            body : {
                                putPresignedUrlList: {
                                    idx: number,
                                    putPresignedUrl: string;
                                }[]
                            }
                        }= res;
                        
                        expect(body?.putPresignedUrlList[0].putPresignedUrl).toBe('hello');
                        expect(body?.putPresignedUrlList.length).toBe(1);

                        const postlist = await postRepo.getPostListBySpaceId(
                            targetSpaceId,
                            0,
                            999,
                            'DESC'
                            );

                        expect(postlist[0].isAnonymous).toBe(1);
                        expect(postlist[0].postName).toBe('POST_TEST_QUESTION');
                        expect(postlist[0].postCategory).toBe('question');

                        const postFileList = await postRepo.getPostFileListByPostId(postlist[0].postId);

                        expect(postFileList.length).toBe(1);
                    });
            });

        });

        describe("공지 작성, POST /space/:spaceId/post/notice", () => {

            let user: IUser;
            let param: SpaceParamDto;
            let body : PostPostDto;

            beforeAll(async() => {

                user = {
                    userId: joinerUserId,
                    email: ' ',
                    firstName: ' ',
                    lastName: ' ',
                    createdAt: ' ',
                    profileImage: ' '
                };

                param = {
                    spaceId: targetSpaceId
                };

                body = await postDto.postDto(
                    'POST_TEST_NOTICE',
                    true,
                    'question'
                );
            });

            it('잘못된 게시글 카테고리', async() => {
                
                try {

                    await controller.postNotice(
                        user,
                        param,
                        body
                    );
                    
                } catch (e) {
    
                    if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['POST-002']);
                    if (e instanceof CustomException) expect(e['statusCode']).toBe(400);
    
                }

            });

            it('공지는 익명 작성 불가능', async() => {

                body.postCategory = 'notice';

                try {

                    await controller.postNotice(
                        user,
                        param,
                        body
                    );
                    
                } catch (e) {
    
                    if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['ROLE-005']);
                    if (e instanceof CustomException) expect(e['statusCode']).toBe(401);
    
                }

            });

            it('공지 작성 권한 없음', async() => {

                body.isAnonymous = false;
                user.userId = joinerUserId;

                try {

                    await controller.postNotice(
                        user,
                        param,
                        body
                    );
                    
                } catch (e) {
    
                    if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['ROLE-006']);
                    if (e instanceof CustomException) expect(e['statusCode']).toBe(401);
    
                }

            });

            it('시나리오 : 공지 작성', async() => {

                const createdAtSpyOn = jest.spyOn(DayjsProvider.prototype, 'getDatetimeByOptions').mockReturnValue(
                    dayjs.addTime(dayjs.getDatetimeByOptions('YYYY-MM-DD HH:mm:ss'), 5, 'minute', 'YYYY-MM-DD HH:mm:ss')
                );

                await req
                    .post(`/space/${targetSpaceId}/post/notice`)
                    .set('Authorization', `Bearer ${adminAccessToken}`)
                    .send(body)
                    .then(async(res) => {

                        const { body } : {
                            body : {
                                putPresignedUrlList: {
                                    idx: number,
                                    putPresignedUrl: string;
                                }[]
                            }
                        }= res;
                        
                        expect(body?.putPresignedUrlList[0].putPresignedUrl).toBe('hello');
                        expect(body?.putPresignedUrlList.length).toBe(1);

                        const postlist = await postRepo.getPostListBySpaceId(
                            targetSpaceId,
                            0,
                            999,
                            'DESC'
                        );

                        expect(postlist[0].isAnonymous).toBe(0);
                        expect(postlist[0].postName).toBe('POST_TEST_NOTICE');
                        expect(postlist[0].postCategory).toBe('notice');

                        const postFileList = await postRepo.getPostFileListByPostId(postlist[0].postId);

                        expect(postFileList.length).toBe(1);

                        expect(createdAtSpyOn).toHaveBeenCalledTimes(2);
                        createdAtSpyOn.mockRestore();
                    });
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