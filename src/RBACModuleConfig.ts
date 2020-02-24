import { PermissionCreate } from './Permissions/PermissionCreate';
import { RoleCreate }       from './Roles/RoleCreate';

export class RBACModuleConfig {

    public initializeModuleDefaults: boolean;
    public roles?: Array<RoleCreate>;
    public permissions?: Array<PermissionCreate>;
    public enableControllers?: boolean;

}
