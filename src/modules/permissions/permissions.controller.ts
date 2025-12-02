import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { RolesGuard } from '../users/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../users/decorators/roles.decorator';

@Controller('permissions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('admin')
export class PermissionsController {
    constructor(private readonly service: PermissionsService) { }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Post()
    create(@Body() dto: CreatePermissionDto) {
        return this.service.create(dto);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
