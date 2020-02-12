import { EntityBase }                                       from '@nestjs.pro/common/dist/entities/EntityBase';
import { ApiProperty }                                      from '@nestjs/swagger';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { Permission }                                       from '../Permissions/Permission';
import { Role }                                             from '../Roles/Role';
import { User }                                             from '../Users/User';

@Entity({ name: 'rbac_organizations' })
export class Organization extends EntityBase {

    @ApiProperty()
    @Column()
    public name?: string;

    @ApiProperty()
    @OneToMany(type => Role, roles => roles.organization)
    public roles?: Array<Role>;

    @ApiProperty()
    @OneToMany(type => Permission, permissions => permissions.organization)
    public permissions?: Array<Permission>;

    @ApiProperty()
    @ManyToMany(type => User, user => user.organization)
    @JoinTable({ name: 'rbac_organizations_users_links' })
    public users?: Array<User>;

}
