import { Injectable } from "@nestjs/common";
import { DataSource, EntityManager } from "typeorm";

export type ServiceLogicFunction<T, Ps> = (manager: EntityManager, managerArgs: Ps) => Promise<T>;

@Injectable()
export class DbUtil {

    constructor(
        protected readonly dataSource: DataSource
    ) { }

    async transaction<T, U>(f: ServiceLogicFunction<T, U>, args : U) {

        try {
            const queryRunner = this.dataSource.createQueryRunner();
            const manager = queryRunner.manager;

            try {

                await queryRunner.connect();
                await queryRunner.startTransaction();

                const result = await f(manager, args);

                await queryRunner.commitTransaction();
                await queryRunner.release();

                return result;

            } catch (e) {

                // console.log("SERVER ERROR:", e);
                
                
                await queryRunner.rollbackTransaction();
                await queryRunner.release();

                throw e;

            };

        } catch (e) {

            throw e;
        }
    };

    async dataSourceProperty(){
        return this.dataSource;
    }
}