import { ApiProperty }        from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class OrganizationCreate {

    @ApiProperty()
    @IsNotEmpty()
    @Length(1, 255)
    public name: string;

}
