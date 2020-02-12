import { ResourceNotFoundException } from '@nestjs.pro/common/dist/exceptions/ResourceNotFoundException';
import { Injectable }                from '@nestjs/common';
import { InjectRepository }          from '@nestjs/typeorm';
import { Organization }              from '../Organizations/Organization';
import { PermissionsService }        from '../Permissions/PermissionsService';
import { User }                      from '../Users/User';
import { UsersService }              from '../Users/UsersService';
import { Role }                      from './Role';
import { RoleCreate }                from './RoleCreate';
import { RoleRepository }            from './RoleRepository';

@Injectable()
export class RolesService {

    private readonly rolesRepository: RoleRepository;
    private readonly permissionsService: PermissionsService;
    private readonly usersService: UsersService;

    public constructor(@InjectRepository(RoleRepository) rolesRepository: RoleRepository,
                       permissionsService: PermissionsService,
                       usersService: UsersService) {

        this.rolesRepository = rolesRepository;
        this.permissionsService = permissionsService;
        this.usersService = usersService;

    }

    /**
     *
     * @param organization
     */
    public search(organization: Organization): Promise<Array<Role>> {

        console.log("search roles");

        return this.rolesRepository.find({ where: { organization: organization } });

    }


    /**
     *
     * @param organization
     * @param id
     */
    public async getById(id: string): Promise<Role> {

        return new Promise(async (resolve, reject) => {

            const role = await this.rolesRepository.findOne({ where: { id } });

            if (role) {

                resolve(role);

            } else {

                reject(new ResourceNotFoundException('could not locate role'));

            }

        });

    }

    /**
     *
     * @param organization
     * @param id
     */
    public async getByIdAndOrganization(id: string, organization: Organization): Promise<Role> {

        return new Promise(async (resolve, reject) => {

            const role = await this.rolesRepository.findOne({ where: { id, organization } });

            if (role) {

                resolve(role);

            } else {

                reject(new ResourceNotFoundException('could not locate role'));

            }

        });

    }

    /**
     *
     * @param organization
     * @param id
     */
    public async getByOrganizationAndName(organization: Organization, name: string): Promise<Role> {

        return new Promise(async (resolve, reject) => {

            const role = await this.rolesRepository.findOne({ where: { organization, name } });

            if (role) {

                resolve(role);

            } else {

                reject(new ResourceNotFoundException('could not locate role'));

            }

        });

    }

    /**
     * Get users belonging to a role id.
     *
     * @return {Promise<Group>}
     * @param id
     */
    public async getUsersById(id: string): Promise<Array<User>> {

        const role = await this.rolesRepository.findOne({

            where: { id },
            relations: [ 'users' ]

        });

        return role.users;

    }

    /**
     * Delete an existing role by it's id and owning organization.
     *
     * @param {Organization} organization
     * @param {string} id
     *
     * @return {Promise<boolean>} Returns true if successful.
     */
    public async deleteByIdAndOrganization(id: string, organization: Organization): Promise<boolean> {

        return (await this.rolesRepository.delete({ id })).affected > 0;

    }

    /**
     * Delete an existing role by it's name and owning organization.
     *
     * @param {Organization} organization
     * @param name
     *
     * @return {Promise<boolean>} Returns true if successful.
     */
    public async deleteByOrganizationAndName(organization: Organization, name: string): Promise<boolean> {

        return (await this.rolesRepository.delete({ organization, name })).affected > 0;

    }

    /**
     * Create a new role.
     *
     * @param principal
     * @param roleCreate
     *
     * @return {Promise<Role>}
     */
    public create(principal: User, roleCreate: RoleCreate): Promise<Role> {

        return this.rolesRepository.save({

            organization: principal.organization,
            name: roleCreate.name,
            description: roleCreate.description,
            type: roleCreate.type

        });

    }

    /**
     * Add a permission to a role.
     *
     * @param principal
     * @param roleId
     * @param permissionId
     *
     * @return {Promise<Role>}
     */
    public async addPermission(principal: User, roleId: string, permissionId: string): Promise<Role> {

        const role = await this.getByIdAndOrganization(roleId, principal.organization);
        const permission = await this.permissionsService.getByOrganizationAndId(principal.organization, permissionId);

        role.permissions.push(permission);

        return this.rolesRepository.save(role);

    }

    /**
     * Remove a permission assignment from an existing role by owning organization.
     *
     * @param organization
     * @param {string} roleId
     * @param {string} permissionId
     *
     * @return {Promise<Role>}
     */
    public async permissionRemove(organization: Organization, roleId: string, permissionId: string): Promise<Role> {

        await this.rolesRepository
                  .createQueryBuilder()
                  .delete()
                  .from(Role)
                  .relation(Role, 'permissions')
                  .of(await this.getByIdAndOrganization(roleId, organization))
                  .remove(await this.permissionsService.getByOrganizationAndId(organization, permissionId));

        return this.getByIdAndOrganization(roleId, organization);

    }

    /**
     * Add a user to a role by owning organization.
     *
     * @param principal
     * @param roleId
     * @param userId
     *
     * @return {Promise<boolean>}
     */
    public async assignToUser(principal: User, roleId: string, userId: string): Promise<boolean> {

        await this.rolesRepository
                  .createQueryBuilder()
                  .relation(Role, 'users')
                  .of(await this.getByIdAndOrganization(roleId, principal.organization))
                  .add(await this.usersService.getByIdAndPrincipalOrganization(principal.organization, userId));

        return true;

    }

    /**
     * Remove a user from a role by owning organization.
     *
     * @param principal
     * @param roleId
     * @param userId
     *
     * @return {Promise<boolean>}
     */
    public async unassignFromUser(principal: User, roleId: string, userId: string): Promise<boolean> {

        await this.rolesRepository
                  .createQueryBuilder()
                  .delete()
                  .from(Role)
                  .relation(Role, 'users')
                  .of(await this.getById(roleId))
                  .remove(await this.usersService.getByIdAndPrincipalOrganization(principal.organization, userId));

        return true;

    }

}
