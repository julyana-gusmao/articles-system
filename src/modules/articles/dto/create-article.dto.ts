import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateArticleDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title!: string;

    @ApiProperty()
    @IsString()
    @MinLength(10)
    content!: string;
}
