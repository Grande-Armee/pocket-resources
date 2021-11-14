import { TransactionalEntityManager } from '../../unitOfWork/providers/unitOfWorkFactory';

export interface RepositoryFactory<Repository> {
  create(entityManager: TransactionalEntityManager): Repository;
}
