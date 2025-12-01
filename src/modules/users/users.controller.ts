import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Param,
    Patch,
    Delete,
    ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles('admin')
    async create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Get()
    @Roles('admin')
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @GetUser() user: any) {
        const userId = user.sub || user.id;

        const isAdmin = user.role === 'admin';
        const isOwner = userId === id;

        if (!isAdmin && !isOwner) {
            throw new ForbiddenException('Acesso negado');
        }

        return this.usersService.findOneById(id);
    }


    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @GetUser() user: any) {
        if (user.role === 'admin') return this.usersService.update(id, dto);
        if (user.sub === id || user.id === id) {
            if ((dto as any).permissionId) {
                throw new ForbiddenException('Somente admin pode alterar permissões');
            }
            return this.usersService.update(id, dto);
        }

        throw new ForbiddenException('Acesso negado');
    }

    @Delete(':id')
    @Roles('admin')
    async remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }

    @Get('me/profile')
    async me(@GetUser() user: any) {
        const id = user.sub || user.id;
        return this.usersService.findOneById(id);
    }
}
