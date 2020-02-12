import { ApiProperty }      from '@nestjs/swagger';
import { IsNotEmpty }       from 'class-validator';
import { PermissionCreate } from '../Permissions/PermissionCreate';
import { RBAC_TYPE }        from '../types/RBACTypes';

export class RoleCreate {

    @ApiProperty()
    @IsNotEmpty()
    public name: string;

    @ApiProperty()
    public description: string;

    public permissions?: Array<PermissionCreate>;
    public type?: RBAC_TYPE;

}
