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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('articles')
@ApiTags('Articles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ArticlesController {
    constructor(private readonly service: ArticlesService) { }

    @Roles('admin', 'editor')
    @Post()
    @ApiOperation({ summary: 'Criar artigo' })
    create(@Body() dto: CreateArticleDto, @Request() req: any) {
        const userId = req.user.sub || req.user.id;
        return this.service.create(dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Listar artigos' })
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar artigo por ID' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Editar artigo' })
    @Roles('admin', 'editor')
    update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Excluir artigo' })
    @Roles('admin', 'editor')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
