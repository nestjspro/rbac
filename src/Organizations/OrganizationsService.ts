import { ResourceAlreadyExistsException } from '@nestjs.pro/common';
import { ResourceNotFoundException }      from '@nestjs.pro/common/dist/exceptions/ResourceNotFoundException';
import { Injectable }                     from '@nestjs/common';
import { InjectRepository }               from '@nestjs/typeorm';
import { Organization }                   from './Organization';
import { OrganizationCreate }             from './OrganizationCreate';
import { OrganizationRepository }         from './OrganizationRepository';

@Injectable()
export class OrganizationsService {

    private readonly organizationRepository: OrganizationRepository;

    public constructor(@InjectRepository(OrganizationRepository) organizationRepository: OrganizationRepository) {

        this.organizationRepository = organizationRepository;

    }

    /**
     * Retrieve an organization by it's name.
     *
     * @param {string} name
     * @returns {Promise<Organization>}
     *
     * @throws {ResourceNotFoundException} Thrown if no name could be found.
     */
    public async getByName(name: string): Promise<Organization> {

        const organization = await this.organizationRepository.getByName(name);

        if (!organization) {

            throw new ResourceNotFoundException('could not locate organization');

        } else {

            return organization;

        }

    }

    /**
     * Create a new organization.
     *
     * @param organizationCreate
     *
     * @returns {Promise<Organization>}
     *
     * @throws {ResourceAlreadyExistsException} Thrown if an organization by the same name already exists.
     */
    public async create(organizationCreate: OrganizationCreate): Promise<Organization> {

        // this.elasticsearchLoggerService.info(`Created organization ${ organizationCreate.name }`);

        return this.organizationRepository.save({ name: organizationCreate.name });

    }

}
