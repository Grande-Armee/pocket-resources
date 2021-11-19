/* eslint-disable unicorn/filename-case */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResourceEntity1637278457553 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE "resources" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        "url" text NOT NULL,
        "title" text,
        "thumbnailUrl" text,
        "content" text,
        CONSTRAINT "PK_resources_id"
          PRIMARY KEY ("id"),
        CONSTRAINT "UQ_resources_url"
          UNIQUE ("url")
      );
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      DROP TABLE "resources";
      `,
    );
  }
}
