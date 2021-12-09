/* eslint-disable unicorn/filename-case */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserResourceTagEntity1637278493639 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE "userResourcesTags" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        "userResourceId" uuid NOT NULL,
        "tagId" uuid NOT NULL,
        CONSTRAINT "PK_userResourcesTags_id"
          PRIMARY KEY ("id"),
        CONSTRAINT "FK_userResourcesTagsUserResourceId_userResourceId"
          FOREIGN KEY ("userResourceId")
          REFERENCES "userResources" ("id")
          ON DELETE CASCADE,
        CONSTRAINT "FK_userResourcesTagsTagId_tagsId"
          FOREIGN KEY ("tagId")
          REFERENCES "tags" ("id")
          ON DELETE CASCADE,
        CONSTRAINT "UQ_userResourcesTagsUserResourceId_userResourcesTagsTagId"
          UNIQUE ("userResourceId", "tagId")
      );
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      DROP TABLE "userResourcesTags";
      `,
    );
  }
}
