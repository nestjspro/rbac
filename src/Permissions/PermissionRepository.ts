import { EntityRepository, Repository } from 'typeorm';
import { Permission }                   from './Permission';

@EntityRepository(Permission)
export class PermissionRepository extends Repository<Permission> {


}
