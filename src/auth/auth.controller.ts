import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() payload: SignInDto) {
    return await this.authService.signIn(payload);
  }

  @Post('/signup')
  async signup(@Body() payload: SignUpDto) {
    return await this.authService.signUp(payload);
  }
}
