import { Collection } from '@domain/collection/entities/collection';
import { CollectionResource } from '@domain/collectionResource/entities/collectionResource';
import { Resource } from '@domain/resource/entities/resource';
import { Tag } from '@domain/tag/entities/tag';
import { UserResource } from '@domain/userResource/entities/userResource';
import { UserResourceTag } from '@domain/userResourceTag/entities/userResourceTag';

export const entities = [Resource, Tag, UserResource, UserResourceTag, Collection, CollectionResource];
