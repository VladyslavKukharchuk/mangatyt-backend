import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684846703775 implements MigrationInterface {
    name = 'migration1684846703775'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" ADD "translatorId" integer`);
        await queryRunner.query(`ALTER TABLE "chapters" ADD CONSTRAINT "FK_6a275b8c2b9d9331362f0999163" FOREIGN KEY ("translatorId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chapters" DROP CONSTRAINT "FK_6a275b8c2b9d9331362f0999163"`);
        await queryRunner.query(`ALTER TABLE "chapters" DROP COLUMN "translatorId"`);
    }

}
