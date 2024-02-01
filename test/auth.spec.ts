import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, EntityManager } from 'typeorm';
import request from 'supertest';

import { BcryptProvider } from '@providers/bcrypt.provider';
import { AppModule } from '../src/app.module';
import { AuthService } from '@services/auth.service';
import { User } from '@entities/user.entity';
import { AuthController } from '@controllers/auth.controller';
import { UserDtoFixture } from './_.fake.datas/dtos/user.dto.fixture';
import { CustomException } from '@common/exception/custom.exception';
import { ECustomExceptionCode } from '@models/enums/e.exception.code';
import { UserRepository } from '@repositories/user.repository';

describe('User Authentication E2E Test', () => {

    let app: INestApplication;
    let config: ConfigService;
    let dataSource: DataSource;
    let entityManager: EntityManager;

    let service: AuthService;
    let controller: AuthController;

    let bcrypt: BcryptProvider;

    let userRepo: UserRepository;

    let userDto: UserDtoFixture;

    let req: request.SuperTest<request.Test>

    let token = '';

    let targetEamil: string;

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

        userRepo = module.get<UserRepository>(UserRepository);

        entityManager = dataSource.createEntityManager();

        userDto = new UserDtoFixture();
        targetEamil = userDto.generateRandomEmail;

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
                email: targetEamil,
                'firstName': " ",
                'lastName': " ",
                'password': " "
            });

            expect(insert.generatedMaps.length).toBe(1);
        })

        it('중복된 아이디', async () => {

            try {

                void await controller.signUp(userDto.signUp(targetEamil));

            } catch (e: unknown) {

                if (e instanceof CustomException) expect(e['errorCode']).toBe(ECustomExceptionCode['USER-001']);
                if (e instanceof CustomException) expect(e['statusCode']).toBe(400);

            }

        });

        it('비밀번호 불일치', async () => {

            const getAuthentificDataSpyOn = jest.spyOn(UserRepository.prototype, 'getAuthentificData').mockRejectedValue(null);

            try {

                void await controller.signUp(userDto.signUp(
                    targetEamil,
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