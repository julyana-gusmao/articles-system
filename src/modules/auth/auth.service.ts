import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from '../users/user.entity';
import { Permission } from '../permissions/permission.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(Permission)
        private readonly permRepo: Repository<Permission>,
        private readonly jwtService: JwtService,
    ) { }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userRepo.findOne({
            where: { email },
            relations: ['permission'],
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        const { password: _p, ...safe } = user as any;
        return safe as User;
    }

    async login(user: User) {
        const dbUser = await this.userRepo.findOne({
            where: { id: (user as any).id },
            relations: ['permission'],
        });

        if (!dbUser) {
            throw new UnauthorizedException('User not found');
        }

        const payload = {
            sub: dbUser.id,
            email: dbUser.email,
            role: dbUser.permission?.name || null,
        };

        const token = this.jwtService.sign(payload);

        const safeUser = {
            id: dbUser.id,
            name: dbUser.name,
            email: dbUser.email,
            permission: dbUser.permission
                ? {
                    id: dbUser.permission.id,
                    name: dbUser.permission.name,
                    description: dbUser.permission.description,
                }
                : null,
        };

        return {
            access_token: token,
            user: safeUser,
        };
    }

    async verifyToken(token: string) {
        try {
            return this.jwtService.verify(token);
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}
