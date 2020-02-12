import { EntityBase }                                   from '@nestjs.pro/common/dist/entities/EntityBase';
import { ApiProperty }                                  from '@nestjs/swagger';
import { IsUUID }                                       from 'class-validator';
import { Column, Entity, Index, ManyToMany, ManyToOne } from 'typeorm';
import { Organization }                                 from '../Organizations/Organization';
import { Permission }                                   from '../Permissions/Permission';
import { RBAC_TYPE }                                    from '../types/RBACTypes';
import { User }                                         from '../Users/User';

@Entity({ name: 'rbac_roles' })
@Index([ 'organization', 'name' ], { unique: true })
export class Role extends EntityBase {

    @ApiProperty()
    @IsUUID('4')
    @ManyToOne(type => Organization, organization => organization.roles, { eager: true })
    public organization?: Organization;

    @ApiProperty()
    @Column()
    public name?: string;

    @ApiProperty()
    @Column()
    public description?: string;

    @ApiProperty()
    @ManyToMany(type => Permission, permission => permission.roles, { eager: true, cascade: true })
    public permissions?: Array<Permission>;

    @ApiProperty()
    @ManyToMany(type => User, user => user.roles)
    public users?: Array<User>;

    @ApiProperty()
    @Column()
    public type: RBAC_TYPE;

}
