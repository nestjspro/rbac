import { EntityRepository, Repository } from 'typeorm';
import { Role }                         from './Role';

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {

}
