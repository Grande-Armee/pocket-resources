/* eslint-disable unicorn/filename-case */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCollectionEntity1637278507241 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE "collections" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        "title" text NOT NULL,
        "thumbnailUrl" text,
        "content" text,
        "userId" uuid NOT NULL,
        CONSTRAINT "PK_collections_id"
          PRIMARY KEY ("id")
      );
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      DROP TABLE "collections";
      `,
    );
  }
}
