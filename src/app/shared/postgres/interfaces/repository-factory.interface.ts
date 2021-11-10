import { TransactionalEntityManager } from '../../unit-of-work/providers/unit-of-work-factory';

export interface RepositoryFactory<Repository> {
  create(entityManager: TransactionalEntityManager): Repository;
}
