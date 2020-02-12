import { EntityBase }                                                                          from '@nestjs.pro/common/dist/entities/EntityBase';
import { ApiProperty }                                                                         from '@nestjs/swagger';
import * as bcrypt                                                                             from 'bcrypt';
import { Exclude }                                                                             from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { Organization }                                                                        from '../Organizations/Organization';
import { Role }                                                                                from '../Roles/Role';
import { UserStatus }                                                                          from './UserStatus';

@Entity('rbac_users')
@Index([ 'email' ], { unique: true })
export class User extends EntityBase {

    @ManyToOne(type => Organization, organization => organization.users, { eager: true })
    public organization: Organization;

    @BeforeInsert()
    @BeforeUpdate()
    public async hashPassword() {

        if (this.password && !this.password.match(/\$2b\$10\$/)) {

            this.password = await bcrypt.hash(this.password, 10);

        }

    }

    @ApiProperty()
    @Column()
    @Exclude({ toPlainOnly: true })
    public password?: string;

    @ApiProperty()
    @Column()
    public status?: UserStatus;

    @ApiProperty()
    @Column({ nullable: true })
    public firstname?: string;

    @ApiProperty()
    @Column({ nullable: true })
    public lastname?: string;

    @ApiProperty()
    @Column()
    public email?: string;

    @Column({ nullable: true, length: 255 })
    public forgotToken: string;

    @Column({ nullable: true, length: 255 })
    public confirmToken: string;

    @ManyToMany(type => Role, role => role.users, { eager: true })
    @JoinTable({ name: 'rbac_users_roles_links' })
    public roles: Array<Role>;

}
