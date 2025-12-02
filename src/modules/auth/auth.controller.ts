import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }
    @Post('login')
    @ApiOperation({ summary: 'Login e obtenção de token JWT' })
    @ApiResponse({ status: 200, description: 'Login realizado com sucesso.', type: AuthResponseDto })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
    async login(@Body() body: LoginDto): Promise<AuthResponseDto> {
        const { email, password } = body;

        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new BadRequestException('Email or password is incorrect');
        }

        return (await this.authService.login(user)) as AuthResponseDto;
    }
}
