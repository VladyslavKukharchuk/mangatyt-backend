import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684786027717 implements MigrationInterface {
    name = 'migration1684786027717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "teams" ("id" SERIAL NOT NULL, "resource_id" character varying NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "cover" text, "name" text NOT NULL, "description" text, "website" character varying, "telegram" character varying, "discord" character varying, CONSTRAINT "UQ_48c0c32e6247a2de155baeaf980" UNIQUE ("name"), CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_79fd81585e09a2ae554aa28373" ON "teams" ("resource_id") `);
        await queryRunner.query(`CREATE TABLE "users_teams_teams" ("usersId" integer NOT NULL, "teamsId" integer NOT NULL, CONSTRAINT "PK_bb05cc6462faa7baf501fa2adc0" PRIMARY KEY ("usersId", "teamsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5d44297b07f4b6ea1418d2fedb" ON "users_teams_teams" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_58b76a3454c868f649f25c0365" ON "users_teams_teams" ("teamsId") `);
        await queryRunner.query(`CREATE TABLE "titles_translators_teams" ("titlesId" integer NOT NULL, "teamsId" integer NOT NULL, CONSTRAINT "PK_2d3863895d4799430c891f781ac" PRIMARY KEY ("titlesId", "teamsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3c2ea3af82b19093b357f32fef" ON "titles_translators_teams" ("titlesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_186ad171bb1defd5949fc705bd" ON "titles_translators_teams" ("teamsId") `);
        await queryRunner.query(`ALTER TABLE "chapters" ALTER COLUMN "volume" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chapters" ALTER COLUMN "number" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users_teams_teams" ADD CONSTRAINT "FK_5d44297b07f4b6ea1418d2fedbc" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_teams_teams" ADD CONSTRAINT "FK_58b76a3454c868f649f25c03652" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "titles_translators_teams" ADD CONSTRAINT "FK_3c2ea3af82b19093b357f32fef7" FOREIGN KEY ("titlesId") REFERENCES "titles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "titles_translators_teams" ADD CONSTRAINT "FK_186ad171bb1defd5949fc705bda" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "titles_translators_teams" DROP CONSTRAINT "FK_186ad171bb1defd5949fc705bda"`);
        await queryRunner.query(`ALTER TABLE "titles_translators_teams" DROP CONSTRAINT "FK_3c2ea3af82b19093b357f32fef7"`);
        await queryRunner.query(`ALTER TABLE "users_teams_teams" DROP CONSTRAINT "FK_58b76a3454c868f649f25c03652"`);
        await queryRunner.query(`ALTER TABLE "users_teams_teams" DROP CONSTRAINT "FK_5d44297b07f4b6ea1418d2fedbc"`);
        await queryRunner.query(`ALTER TABLE "chapters" ALTER COLUMN "number" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chapters" ALTER COLUMN "volume" DROP NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_186ad171bb1defd5949fc705bd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c2ea3af82b19093b357f32fef"`);
        await queryRunner.query(`DROP TABLE "titles_translators_teams"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_58b76a3454c868f649f25c0365"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5d44297b07f4b6ea1418d2fedb"`);
        await queryRunner.query(`DROP TABLE "users_teams_teams"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_79fd81585e09a2ae554aa28373"`);
        await queryRunner.query(`DROP TABLE "teams"`);
    }

}
