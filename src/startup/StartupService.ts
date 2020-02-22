import { Inject, Injectable, OnModuleInit }             from '@nestjs/common';
import { PermissionsService }                           from '../Permissions/PermissionsService';
import { RBACModuleConfig }                             from '../RBACModuleConfig';
import { RolesService }                                 from '../Roles/RolesService';
import { UsersService }                                 from '../Users/UsersService';
import { RBAC_DEFAULT_PERMISSIONS, RBAC_DEFAULT_ROLES } from './Defaults';

@Injectable()
export class StartupService implements OnModuleInit {

    public constructor(@Inject('CONFIG') private readonly config: RBACModuleConfig,
                       private readonly usersService: UsersService,
                       private readonly rolesService: RolesService,
                       private readonly permissionsService: PermissionsService) {

    }

    public async onModuleInit() {

        if (this.config.initializeModuleDefaults) {

            await this.usersService.register({

                email: 'test@test.com',
                password: 'asdfasdf'

            }).catch(async (e) => {

                // user already exists
                // await this.usersService.deleteById((await this.usersService.getByEmail('test@test.com')).id);
                //
                // await this.usersService.register({
                //
                //     email: 'test@test.com',
                //     password: 'asdfasdf'
                //
                // });
                console.log(e);


            });

            const principal = await this.usersService.getByEmail('test@test.com');

            console.log(principal);

            await this.rolesService.deleteByOrganizationAndName(principal.organization, 'rbac.admin');

            const role = await this.rolesService.create(principal, RBAC_DEFAULT_ROLES[ 0 ]);

            for (let permissionCreate of RBAC_DEFAULT_PERMISSIONS) {

                permissionCreate.roles = [ role ];

                await this.permissionsService.create(principal.organization, permissionCreate).then(() => {

                    console.log(`Created permission "${ permissionCreate.name }..`);

                }).catch(() => {

                    console.log(`Permission already exists "${ permissionCreate.name }..`);

                });

                await this.rolesService.addPermission(principal, role.id, (await this.permissionsService.getByOrganizationAndName(principal.organization, permissionCreate.name)).id);

            }

            console.log(`Assigning role "rbac.admin" to user "${ principal.email }`);

            await this.rolesService.unassignFromUser(principal, (await this.rolesService.getByOrganizationAndName(principal.organization, 'rbac.admin')).id, principal.id);
            await this.rolesService.assignToUser(principal, (await this.rolesService.getByOrganizationAndName(principal.organization, 'rbac.admin')).id, principal.id);

        }

        await this.createConfigBasedPermissions();

    }

    private async createConfigBasedPermissions(): Promise<void> {

        if (this.config.roles) {

            const principal = await this.usersService.getByEmail('test@test.com');

            for (let roleCreate of this.config.roles) {

                await this.rolesService.deleteByOrganizationAndName(principal.organization, roleCreate.name);

                const role = await this.rolesService.create(principal, roleCreate);

                for (let permissionCreate of roleCreate.permissions) {

                    await this.permissionsService.create(principal.organization, permissionCreate).then(() => {

                        console.log(`Created permission "${ permissionCreate.name }..`);

                    }).catch(() => {

                        console.log(`Permission already exists "${ permissionCreate.name }..`);

                    });

                    await this.rolesService.addPermission(principal, role.id, (await this.permissionsService.getByOrganizationAndName(principal.organization, permissionCreate.name)).id);

                }

            }

        }

        return null;

    }

}
