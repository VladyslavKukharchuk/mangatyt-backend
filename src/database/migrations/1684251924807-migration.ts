import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1684251924807 implements MigrationInterface {
    name = 'migration1684251924807'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "authors" ADD CONSTRAINT "UQ_c2472bf44447f49412c585a431a" UNIQUE ("englishName")`);
        await queryRunner.query(`ALTER TABLE "authors" ADD CONSTRAINT "UQ_d5ba443605da029ff4f0c0a1796" UNIQUE ("ukrainianName")`);
        await queryRunner.query(`ALTER TABLE "authors" ADD CONSTRAINT "UQ_30ba8f6a04fd6020d3586332602" UNIQUE ("originalName")`);
        await queryRunner.query(`ALTER TABLE "titles" ADD CONSTRAINT "UQ_692c1fff4ff83e6f090e9469106" UNIQUE ("ukrainianName")`);
        await queryRunner.query(`ALTER TABLE "titles" ADD CONSTRAINT "UQ_080586c70b447d75e2387c04d35" UNIQUE ("englishName")`);
        await queryRunner.query(`ALTER TABLE "titles" ADD CONSTRAINT "UQ_326c0a2cf3b918538a5a0bc8d75" UNIQUE ("originalName")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "titles" DROP CONSTRAINT "UQ_326c0a2cf3b918538a5a0bc8d75"`);
        await queryRunner.query(`ALTER TABLE "titles" DROP CONSTRAINT "UQ_080586c70b447d75e2387c04d35"`);
        await queryRunner.query(`ALTER TABLE "titles" DROP CONSTRAINT "UQ_692c1fff4ff83e6f090e9469106"`);
        await queryRunner.query(`ALTER TABLE "authors" DROP CONSTRAINT "UQ_30ba8f6a04fd6020d3586332602"`);
        await queryRunner.query(`ALTER TABLE "authors" DROP CONSTRAINT "UQ_d5ba443605da029ff4f0c0a1796"`);
        await queryRunner.query(`ALTER TABLE "authors" DROP CONSTRAINT "UQ_c2472bf44447f49412c585a431a"`);
    }

}
