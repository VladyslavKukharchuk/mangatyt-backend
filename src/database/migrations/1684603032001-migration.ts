import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684603032001 implements MigrationInterface {
    name = 'migration1684603032001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" ALTER COLUMN "pages" SET DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" ALTER COLUMN "pages" DROP DEFAULT`);
    }

}
