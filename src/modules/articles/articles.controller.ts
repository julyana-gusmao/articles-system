import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('articles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticlesController {
    constructor(private readonly service: ArticlesService) { }

    @Post()
    @Roles('admin', 'editor')
    create(@Body() dto: CreateArticleDto, @Request() req: any) {
        const userId = req.user.sub || req.user.id;
        return this.service.create(dto, userId);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @Roles('admin', 'editor')
    update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles('admin', 'editor')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
