import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager, InsertResult } from 'typeorm';
import request from 'supertest';

import { BcryptProvider } from '@providers/bcrypt.provider';
import { AppModule } from '../../src/app.module';
import { AuthService } from '@services/auth.service';
import { User } from '@entities/user.entity';
import { AuthController } from '@controllers/auth.controller';
import { UserDtoFixture } from '../_.fake.datas/dtos/user.dto.fixture';
import { CustomException } from '@common/exception/custom.exception';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { UserRepository } from '@repositories/user.repository';
import { PostSignUpDto } from '@dtos/auths/post.sign.up.dto';
import { PostSignInDto } from '@dtos/auths/post.sign.in.dto';
import { JwtProvider } from '@providers/jwt.provider';

describe('User Authentication Test', () => {

    let app: INestApplication;
    let config: ConfigService;
    let dataSource: DataSource;
    let entityManager: EntityManager;

    let service: AuthService;
    let controller: AuthController;

    let bcrypt: BcryptProvider;
    let jwt: JwtProvider;

    let userDto: UserDtoFixture;

    let req: request.SuperTest<request.Test>

    let accessToken = '';
    let refreshToken = '';

    let dupEmail: string;
    let targetEmail: string;
    let targetPassword: string;

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

        controller = module.get<AuthController>(AuthController);
        service = module.get<AuthService>(AuthService);

        bcrypt = module.get<BcryptProvider>(BcryptProvider);
        jwt = module.get<JwtProvider>(JwtProvider);

        entityManager = dataSource.createEntityManager();

        userDto = new UserDtoFixture();
        dupEmail = userDto.generateRandomEmail;

        req = request(app.getHttpServer());

    });

    it('AuthService Property Define', async () => {

        expect(service['bcrypt']).toBeDefined();
        expect(service['db']).toBeDefined();
        expect(service['jwt']).toBeDefined();
        expect(service['userRepo']).toBeDefined();

        expect(controller['service']).toBeDefined();

    })

    describe("회원가입, POST /auth/sign-up", () => {

        beforeAll(async () => {
            const insert = await entityManager.insert(User, {
                email: dupEmail,
                'firstName': " ",
                'lastName': " ",
                'password': " "
            });

            expect(insert.generatedMaps.length).toBe(1);
        })

        it('중복된 아이디', async () => {

            try {

                void await controller.signUp(userDto.signUp(dupEmail));

            } catch (e: unknown) {

                if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['USER-001']);
                if (e instanceof CustomException) expect(e['statusCode']).toBe(400);

            }

        });

        it('비밀번호 불일치', async () => {

            const getAuthentificDataSpyOn = jest.spyOn(UserRepository.prototype, 'getAuthentificData').mockImplementation(
                async () => {
                    return null
                });

            try {

                void await controller.signUp(userDto.signUp(
                    dupEmail,
                    'aaaa1234!',
                    'aaaa1234@'
                ));

            } catch (e: unknown) {

                if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['INCORECT-PWD']);
                if (e instanceof CustomException) expect(e['statusCode']).toBe(400);

            };

            expect(getAuthentificDataSpyOn).toHaveBeenCalledTimes(1);

        });

        it('유저 생성 실패', async () => {

            const getAuthentificDataSpyOn = jest.spyOn(UserRepository.prototype, 'getAuthentificData').mockResolvedValue(null);
            const matchedSpyOn = jest.spyOn(BcryptProvider.prototype, 'matchedPassword').mockReturnValue(true);
            const hashedSpyOn = jest.spyOn(BcryptProvider.prototype, 'hashPassword').mockResolvedValue(' ')
            const insertSpyOn = jest.spyOn(UserRepository.prototype, 'insertUserEntity').mockResolvedValue({
                generatedMaps: [] as unknown
            } as InsertResult);

            try {

                void await controller.signUp({} as PostSignUpDto);

            } catch (e: unknown) {

                if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['AWS-RDS-EXCEPTION']);
                if (e instanceof CustomException) expect(e['statusCode']).toBe(500);

            };

            expect(getAuthentificDataSpyOn).toHaveBeenCalledTimes(1);
            expect(matchedSpyOn).toHaveBeenCalledTimes(1);
            expect(hashedSpyOn).toHaveBeenCalledTimes(1);
            expect(insertSpyOn).toHaveBeenCalledTimes(1);

        });

        it('회원가입', async () => {

            targetPassword = userDto.generateRandomPassword;
            targetEmail = userDto.generateRandomEmail;
            const signUpdto = userDto.signUp(
                targetEmail,
                targetPassword,
                targetPassword
            );

            await req
                .post('/auth/sign-up')
                .send(signUpdto)
                .then(async (res) => {

                    const user = await entityManager.findOne(User, {
                        where: {
                            email: targetEmail
                        }
                    });

                    expect(user).toBeTruthy();

                })
        });

    });

    describe("로그인, POST /auth/sign-in", () => {

        it('존재하지 않는 유저', async () => {

            try {

                await controller.signIn({} as PostSignInDto);

            } catch (e) {

                if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['USER-002']);
                if (e instanceof CustomException) expect(e['statusCode']).toBe(400);

            };

        });

        it('존재하지 않는 유저', async () => {

            const getAuthentificDataSpyOn = jest.spyOn(UserRepository.prototype, 'getAuthentificData').mockResolvedValue(new User());

            try {

                await controller.signIn({
                    email: ' ',
                    password: ' '
                } as PostSignInDto);

            } catch (e) {

                if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['INCORECT-DB-PWD']);
                if (e instanceof CustomException) expect(e['statusCode']).toBe(400);

            };

            expect(getAuthentificDataSpyOn).toHaveBeenCalledTimes(1);

        });

        it('로그인', async () => {

            const send: PostSignInDto = {
                email: targetEmail,
                password: targetPassword
            };

            await req
                .post('/auth/sign-in')
                .send(send)
                .then(async (res) => {

                    const { body }: {
                        body: {
                            tokens: {
                                accessToken: string,
                                refreshToken: string
                            }
                        }
                    } = res;

                    const access = body.tokens.accessToken;
                    const decodeAccess = jwt.verifyToken(access);
                    if(decodeAccess){
                        const expired = jwt.verifyExp(decodeAccess, 'AccessToken');
                        expect(expired).toBeTruthy();
                    };
                    const refresh = body.tokens.refreshToken;
                    const decodeRefresh = jwt.verifyToken(refresh);
                    if(decodeRefresh) {
                        const expired2 = jwt.verifyExp(decodeRefresh, 'RefreshToken');
                        expect(expired2).toBeTruthy();
                    }

                    accessToken = access;
                    refreshToken = refresh;

                })

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