import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(ctx: ExecutionContext) {
        const required = this.reflector.get<string[]>('roles', ctx.getHandler());
        if (!required) return true;

        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.role) {
            throw new ForbiddenException('Acesso negado');
        }

        if (!required.includes(user.role)) {
            throw new ForbiddenException('Permissão insuficiente');
        }

        return true;
    }
}
