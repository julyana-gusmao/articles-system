import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    name!: string;

    @ApiProperty()
    @IsEmail()
    email!: string;

    @ApiProperty()
    @MinLength(6)
    password!: string;

    @ApiProperty()
    @IsOptional()
    permissionId?: string;
}
