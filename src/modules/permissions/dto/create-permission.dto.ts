import { IsString, MinLength } from 'class-validator';

export class CreatePermissionDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    description: string;
}
