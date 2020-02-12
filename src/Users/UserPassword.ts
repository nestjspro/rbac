import { ApiProperty } from '@nestjs/swagger';

export class UserPassword {

    @ApiProperty()
    public password: string;

}
