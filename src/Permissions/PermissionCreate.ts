import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty }  from 'class-validator';
import { Role }        from '../Roles/Role';
import { RBAC_TYPE }   from '../types/RBACTypes';

export class PermissionCreate {

    @ApiProperty()
    @IsNotEmpty()
    public name: string;

    @ApiProperty()
    public description: string;

    public type?: RBAC_TYPE;
    public roles?: Array<Role>;

}
