import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './user.entity';
import { Permission } from '../permissions/permission.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Permission)
        private permRepo: Repository<Permission>,
    ) { }

    private sanitize(user: User) {
        const { password, ...safe } = user as any;
        return safe;
    }

    async create(createDto: CreateUserDto) {
        const exists = await this.userRepo.findOne({ where: { email: createDto.email } });
        if (exists) throw new BadRequestException('Email já cadastrado');

        const hashed = await bcrypt.hash(createDto.password, 10);

        let permission: Permission | undefined = undefined;

        if (createDto.permissionId) {
            const found = await this.permRepo.findOne({ where: { id: createDto.permissionId } });
            if (!found) throw new BadRequestException('Permissão inválida');
            permission = found;
        }

        const user = this.userRepo.create({
            name: createDto.name,
            email: createDto.email,
            password: hashed,
            permission,
        });

        const savedUser = await this.userRepo.save(user);
        return this.sanitize(savedUser);
    }

    async findAll() {
        const users = await this.userRepo.find({ relations: ['permission'] });
        return users.map(u => this.sanitize(u));
    }

    async findOneById(id: string) {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['permission'] });
        if (!user) throw new NotFoundException('Usuário não encontrado');
        return this.sanitize(user);
    }

    async findByEmail(email: string) {
        const user = await this.userRepo.findOne({ where: { email }, relations: ['permission'] });
        return user ? this.sanitize(user) : null;
    }

    async update(id: string, dto: UpdateUserDto) {
        const user = await this.userRepo.findOne({ where: { id }, relations: ['permission'] });
        if (!user) throw new NotFoundException('Usuário não encontrado');

        if (dto.email && dto.email !== user.email) {
            const exists = await this.userRepo.findOne({ where: { email: dto.email } });
            if (exists) throw new BadRequestException('Email já em uso');
        }

        if (dto.password) {
            user.password = await bcrypt.hash(dto.password, 10);
        }

        if (dto.name) user.name = dto.name;
        if (dto.email) user.email = dto.email;

        if (dto.permissionId) {
            const perm = await this.permRepo.findOne({ where: { id: dto.permissionId } });
            if (!perm) throw new BadRequestException('Permissão inválida');
            user.permission = { id: perm.id } as Permission;
        }

        const saved = await this.userRepo.save(user);
        return this.sanitize(saved);
    }

    async remove(id: string) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('Usuário não encontrado');
        await this.userRepo.softRemove ? this.userRepo.softRemove(user) : this.userRepo.remove(user);
        return { deleted: true };
    }
}
