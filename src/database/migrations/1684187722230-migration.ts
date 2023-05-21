import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684187722230 implements MigrationInterface {
    name = 'migration1684187722230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "authors" ALTER COLUMN "description" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "authors" ALTER COLUMN "description" SET NOT NULL`);
    }

}
