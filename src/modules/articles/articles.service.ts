import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private repo: Repository<Article>,
    ) { }

    async create(dto: CreateArticleDto, author: User) {
        const article = this.repo.create({
            title: dto.title,
            content: dto.content,
            author: { id: author.id } as any,
        });
        return this.repo.save(article);
    }

    async findAll() {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async findOne(id: string) {
        const art = await this.repo.findOne({ where: { id } });
        if (!art) throw new NotFoundException('Artigo não encontrado');
        return art;
    }

    async update(id: string, dto: UpdateArticleDto) {
        const art = await this.findOne(id);
        Object.assign(art, dto);
        return this.repo.save(art);
    }

    async remove(id: string) {
        const art = await this.findOne(id);
        await this.repo.remove(art);
        return { deleted: true };
    }
}
