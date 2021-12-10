/* eslint-disable unicorn/filename-case */

import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCollectionResourceEntity1637278537768 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE "collectionResources" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" timestamp NOT NULL DEFAULT now(),
        "updatedAt" timestamp NOT NULL DEFAULT now(),
        "collectionId" uuid NOT NULL,
        "resourceId" uuid NOT NULL,
        CONSTRAINT "PK_collectionResources_id"
          PRIMARY KEY ("id"),
        CONSTRAINT "FK_collectionResourcesResourceId_resourcesId"
          FOREIGN KEY ("resourceId")
          REFERENCES "resources" ("id")
          ON DELETE CASCADE,
        CONSTRAINT "FK_collectionResourcesCollectionId_collectionsId"
          FOREIGN KEY ("collectionId")
          REFERENCES "collections" ("id")
          ON DELETE CASCADE,
        CONSTRAINT "UQ_collectionResourcesCollectionId_collectionResourcesResourceId"
          UNIQUE ("collectionId", "resourceId")
      );
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      DROP TABLE "collectionResources";
      `,
    );
  }
}
