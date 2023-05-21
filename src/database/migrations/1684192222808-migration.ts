import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684192222808 implements MigrationInterface {
    name = 'migration1684192222808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "titles" ALTER COLUMN "cover" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "titles" ALTER COLUMN "cover" SET NOT NULL`);
    }

}
