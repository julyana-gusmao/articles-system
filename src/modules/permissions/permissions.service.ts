import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission)
        private readonly repo: Repository<Permission>,
    ) { }

    findAll() {
        return this.repo.find();
    }

    async findOne(id: string) {
        const perm = await this.repo.findOne({ where: { id } });
        if (!perm) throw new NotFoundException('Permissão não encontrada');
        return perm;
    }

    async create(dto: CreatePermissionDto) {
        const perm = this.repo.create(dto);
        return this.repo.save(perm);
    }

    async update(id: string, dto: UpdatePermissionDto) {
        const perm = await this.findOne(id);
        Object.assign(perm, dto);
        return this.repo.save(perm);
    }

    async remove(id: string) {
        const perm = await this.findOne(id);
        return this.repo.remove(perm);
    }
}
