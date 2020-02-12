import { ResourceAlreadyExistsException } from '@nestjs.pro/common';
import { ResourceNotFoundException }      from '@nestjs.pro/common/dist/exceptions/ResourceNotFoundException';
import { Injectable }                     from '@nestjs/common';
import { InjectRepository }               from '@nestjs/typeorm';
import { Organization }                   from '../Organizations/Organization';
import { User }                           from '../Users/User';
import { Permission }                     from './Permission';
import { PermissionCreate }               from './PermissionCreate';
import { PermissionRepository }           from './PermissionRepository';

@Injectable()
export class PermissionsService {

    /**
     * Permissions repository.
     */
    private readonly permissionsRepository: PermissionRepository;

    /**
     * D.I.
     *
     * @param {PermissionRepository} permissionsRepository
     * @param {RolesService} rolesService
     */
    public constructor(@InjectRepository(PermissionRepository) permissionsRepository: PermissionRepository) {

        this.permissionsRepository = permissionsRepository;

    }

    /**
     * Retrieve all permissions by organization.
     *
     * @param {Organization} organization
     *
     * @returns {Promise<Array<Permission>>}
     */
    public getByOrganization(organization: Organization): Promise<Array<Permission>> {

        return this.permissionsRepository.find({ where: { organization }, order: { name: 'DESC' } });

    }

    /**
     * Retrieve an existing permission by organization and id.
     *
     * @param {Organization} organization
     * @param {string} id
     *
     * @returns {Promise<Permission>}
     *
     * @throws {ResourceNotFoundException} Thrown if permission could not be located.
     */
    public getByOrganizationAndId(organization: Organization, id: string): Promise<Permission> {

        return new Promise(async (resolve, reject) => {

            const permission = await this.permissionsRepository.findOne({ where: { id }, relations: [ 'roles' ] });

            if (permission) {

                resolve(permission);

            } else {

                reject(new ResourceNotFoundException('could not locate permission'));

            }

        });

    }

    /**
     * Retreive an existing permission by organization and name.
     *
     * @param {Organization} organization
     * @param {string} name
     *
     * @returns {Promise<Permission>}
     *
     * @throws {ResourceNotFoundException} Thrown if permission could not be located.
     */
    public getByOrganizationAndName(organization: Organization, name: string): Promise<Permission> {

        return new Promise(async (resolve, reject) => {

            const permission = await this.permissionsRepository.findOne({ where: { organization, name } });

            if (permission) {

                resolve(permission);

            } else {

                reject(new ResourceNotFoundException('could not locate permission'));

            }

        });

    }

    /**
     * Create a new permission.
     *
     * @param {User} principal
     * @param {PermissionCreate} permissionCreate
     *
     * @returns {Promise<Permission>}
     *
     * @throws {ResourceAlreadyExistsException} Thrown if a permission with the same organization and name already exists.
     */
    public async create(organization: Organization, permissionCreate: PermissionCreate): Promise<Permission> {

        return new Promise((resolve, reject) => {

            this.getByOrganizationAndName(organization, permissionCreate.name).catch(e => {

                const permission = new Permission();

                permission.organization = organization;
                permission.name = permissionCreate.name;
                permission.description = permissionCreate.description;
                permission.type = permissionCreate.type;

                resolve(this.permissionsRepository.save(permission));

            }).then(result => {

                reject(new ResourceAlreadyExistsException(`permission with the name "${ permissionCreate.name }" already exists`));

            });

        });

    }

    /**
     * Delete an existing permission by it's owning organization and permission id.
     *
     * @param {User} principal
     * @param {string} permissionId
     *
     * @returns {Promise<boolean>} Returns true if successful.
     *
     * @throws {ResourceNotFoundException} Thrown if permission could not be located.
     */
    public deleteByOrganizationAndId(principal: User, permissionId: string): Promise<boolean> {

        return new Promise((resolve, reject) => {

            this.getByOrganizationAndId(principal.organization, permissionId).catch(e => {

                reject(e);

            }).then(async (permission: Permission) => {

                if (permission) {

                    const result = await this.permissionsRepository.remove(permission);

                    if (result) {

                        resolve(true);

                    } else {

                        reject(false);

                    }

                }

            });

        });

    }

}
