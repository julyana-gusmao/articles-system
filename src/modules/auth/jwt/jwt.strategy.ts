import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly config: ConfigService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_SECRET') || 'changeme',
        });
    }

    async validate(payload: any) {
        const user = await this.userRepo.findOne({
            where: { id: payload.sub },
            relations: ['permission'],
        });

        if (!user) return null;

        const { password: _p, ...safe } = user as any;
        return {
            ...safe,
            role: user.permission?.name || null,
        };
    }
}
