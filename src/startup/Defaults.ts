import { PermissionCreate } from '../Permissions/PermissionCreate';
import { RoleCreate }       from '../Roles/RoleCreate';
import { RBAC_TYPE }        from '../types/RBACTypes';

export const RBAC_DEFAULT_PERMISSIONS: Array<PermissionCreate> = [

    {

        name: 'rbac.tokens.search',
        description: 'Ability to create new API tokens.',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.tokens.get',
        description: 'Ability to create new API tokens.',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.tokens.create',
        description: 'Ability to create new API tokens.',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.tokens.update',
        description: 'Ability to create new API tokens.',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.tokens.delete',
        description: 'Ability to create new API tokens.',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.users.search',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.users.get',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.users.create',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.users.update',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.users.delete',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.organizations.search',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.organizations.get',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.organizations.create',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.organizations.update',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.organizations.delete',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.roles.search',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.roles.get',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.roles.create',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.roles.update',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.roles.delete',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.permissions.search',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.permissions.get',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.permissions.create',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.permissions.update',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }, {

        name: 'rbac.permissions.delete',
        description: '',
        type: RBAC_TYPE.SYSTEM

    }

];

export const RBAC_DEFAULT_ROLES: Array<RoleCreate> = [

    {

        name: 'rbac.admin',
        description: 'Full access to RBAC services.',
        permissions: RBAC_DEFAULT_PERMISSIONS,
        type: RBAC_TYPE.SYSTEM

    }

];
