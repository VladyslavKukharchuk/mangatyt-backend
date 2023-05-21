import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684149487598 implements MigrationInterface {
    name = 'migration1684149487598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chapters" ("id" SERIAL NOT NULL, "resource_id" character varying NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "volume" integer, "number" integer, "ukrainianName" text, "englishName" text, "originalName" text, "titleId" integer, CONSTRAINT "PK_a2bbdbb4bdc786fe0cb0fcfc4a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ff24f38508db13a7086b5b8890" ON "chapters" ("resource_id") `);
        await queryRunner.query(`CREATE TYPE "public"."titles_type_enum" AS ENUM('manga', 'manhwa', 'manhua')`);
        await queryRunner.query(`CREATE TYPE "public"."titles_status_enum" AS ENUM('announced', 'ongoing', 'discontinued', 'completed', 'suspended')`);
        await queryRunner.query(`CREATE TYPE "public"."titles_translatestatus_enum" AS ENUM('continued', 'frozen', 'abandoned', 'completed')`);
        await queryRunner.query(`CREATE TABLE "titles" ("id" SERIAL NOT NULL, "resource_id" character varying NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "cover" text NOT NULL, "ukrainianName" text NOT NULL, "englishName" text NOT NULL, "originalName" text, "type" "public"."titles_type_enum" NOT NULL, "year" integer NOT NULL, "status" "public"."titles_status_enum" NOT NULL, "translateStatus" "public"."titles_translatestatus_enum" NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_7c5aeca381c331c3aaf9d50931c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8b029d59784e0e30e947e3cc97" ON "titles" ("resource_id") `);
        await queryRunner.query(`CREATE TABLE "authors" ("id" SERIAL NOT NULL, "resource_id" character varying NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "photo" text, "englishName" text NOT NULL, "ukrainianName" text, "originalName" text, "description" text NOT NULL, CONSTRAINT "PK_d2ed02fabd9b52847ccb85e6b88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0bdf6975f1924588fcb8e676e7" ON "authors" ("resource_id") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "resource_id" character varying NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "sub" character varying NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, CONSTRAINT "UQ_2ca016813ffcce3392b3eb8ed0c" UNIQUE ("sub"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4a559911dbcd6c035c1cd96463" ON "users" ("resource_id") `);
        await queryRunner.query(`CREATE TABLE "titles_authors_authors" ("titlesId" integer NOT NULL, "authorsId" integer NOT NULL, CONSTRAINT "PK_1fe82b99705829dc2d35155ff44" PRIMARY KEY ("titlesId", "authorsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_49a99b5f178fb80f97448405bc" ON "titles_authors_authors" ("titlesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_13ca654972e32b880e46168765" ON "titles_authors_authors" ("authorsId") `);
        await queryRunner.query(`ALTER TABLE "chapters" ADD CONSTRAINT "FK_55ccfdc54151747c41c5cc5ddb2" FOREIGN KEY ("titleId") REFERENCES "titles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "titles_authors_authors" ADD CONSTRAINT "FK_49a99b5f178fb80f97448405bc6" FOREIGN KEY ("titlesId") REFERENCES "titles"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "titles_authors_authors" ADD CONSTRAINT "FK_13ca654972e32b880e461687651" FOREIGN KEY ("authorsId") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "titles_authors_authors" DROP CONSTRAINT "FK_13ca654972e32b880e461687651"`);
        await queryRunner.query(`ALTER TABLE "titles_authors_authors" DROP CONSTRAINT "FK_49a99b5f178fb80f97448405bc6"`);
        await queryRunner.query(`ALTER TABLE "chapters" DROP CONSTRAINT "FK_55ccfdc54151747c41c5cc5ddb2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_13ca654972e32b880e46168765"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_49a99b5f178fb80f97448405bc"`);
        await queryRunner.query(`DROP TABLE "titles_authors_authors"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4a559911dbcd6c035c1cd96463"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0bdf6975f1924588fcb8e676e7"`);
        await queryRunner.query(`DROP TABLE "authors"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b029d59784e0e30e947e3cc97"`);
        await queryRunner.query(`DROP TABLE "titles"`);
        await queryRunner.query(`DROP TYPE "public"."titles_translatestatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."titles_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."titles_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff24f38508db13a7086b5b8890"`);
        await queryRunner.query(`DROP TABLE "chapters"`);
    }

}
