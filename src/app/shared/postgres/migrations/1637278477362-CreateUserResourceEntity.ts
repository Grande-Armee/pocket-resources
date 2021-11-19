/* eslint-disable unicorn/filename-case */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserResourceEntity1637278477362 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TYPE "userResourcesStatus" AS ENUM (
        'toRead',
        'inArchive',
        'inTrash'
      );
      `,
    );

    await queryRunner.query(
      `
      CREATE TABLE "userResources" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        "resourceId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        "status" "userResourcesStatus" NOT NULL DEFAULT 'toRead',
        "isFavorite" boolean NOT NULL DEFAULT false,
        "rating" int,
        CONSTRAINT "PK_userResources_id"
          PRIMARY KEY ("id"),
        CONSTRAINT "FK_userResourcesResourceId_resourcesId"
          FOREIGN KEY ("resourceId")
          REFERENCES "resources" ("id")
          ON DELETE CASCADE,
        CONSTRAINT "UQ_userResourcesResourceId_userResourcesUserId"
          UNIQUE ("resourceId", "userId")
      );
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      DROP TABLE "userResources";
      `,
    );

    await queryRunner.query(
      `
      DROP TYPE "userResourcesStatus";
      `,
    );
  }
}
