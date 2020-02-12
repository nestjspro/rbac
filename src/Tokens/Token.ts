import { EntityBase }                from '@nestjs.pro/common/dist/entities/EntityBase';
import { ApiProperty }               from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Organization }              from '../Organizations/Organization';
import { User }                      from '../Users/User';

@Entity('rbac_tokens')
export class Token extends EntityBase {

    @ApiProperty()
    @Column({ length: 255 })
    public token: string;

    @ManyToOne(type => Organization)
    public organization: Organization;

    @ManyToOne(type => User)
    public user: User;

    @ApiProperty()
    @Column({ length: 255 })
    public name: string;

    @ApiProperty()
    @Column({ length: 255 })
    public description: string;

}
