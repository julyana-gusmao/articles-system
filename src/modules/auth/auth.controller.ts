import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() body: LoginDto): Promise<AuthResponseDto> {
        const { email, password } = body;

        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new BadRequestException('Email or password is incorrect');
        }

        return (await this.authService.login(user)) as AuthResponseDto;
    }
}
