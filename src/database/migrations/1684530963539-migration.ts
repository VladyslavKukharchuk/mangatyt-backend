import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684530963539 implements MigrationInterface {
    name = 'migration1684530963539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" ADD "pages" text array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "pages"`);
    }

}
