import { Organization }            from './Organizations/Organization';
import { OrganizationRepository }  from './Organizations/OrganizationRepository';
import { OrganizationsController } from './Organizations/OrganizationsController';
import { OrganizationsService }    from './Organizations/OrganizationsService';
import { Permission }              from './Permissions/Permission';
import { PermissionRepository }    from './Permissions/PermissionRepository';
import { PermissionsController }   from './Permissions/PermissionsController';
import { PermissionsService }      from './Permissions/PermissionsService';
import { Role }                    from './Roles/Role';
import { RoleRepository }          from './Roles/RoleRepository';
import { RolesController }         from './Roles/RolesController';
import { RolesService }            from './Roles/RolesService';
import { StartupService }          from './startup/StartupService';
import { Token }                   from './Tokens/Token';
import { TokenRepository }         from './Tokens/TokenRepository';
import { TokensController }        from './Tokens/TokensController';
import { TokensService }           from './Tokens/TokensService';
import { User }                    from './Users/User';
import { UserRepository }          from './Users/UserRepository';
import { UsersController }         from './Users/UsersController';
import { UsersService }            from './Users/UsersService';

export const RBAC_ENTITIES = [

    Organization,
    Permission,
    Role,
    Token,
    User

];

export const RBAC_REPOSITORIES = [

    OrganizationRepository,
    PermissionRepository,
    RoleRepository,
    TokenRepository,
    UserRepository

];

export const RBAC_PROVIDERS = [

    OrganizationsService,
    PermissionsService,
    RolesService,
    TokensService,
    UsersService,

    StartupService

];

export const RBAC_CONTROLLERS = [

    OrganizationsController,
    PermissionsController,
    RolesController,
    TokensController,
    UsersController

];
