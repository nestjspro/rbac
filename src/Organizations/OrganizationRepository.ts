import { EntityRepository, Repository } from 'typeorm';
import { Organization }                 from './Organization';

@EntityRepository(Organization)
export class OrganizationRepository extends Repository<Organization> {

    public getByName(name: string): Promise<Organization> {

        return this.findOne({ where: { name } });

    }

}
