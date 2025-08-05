import { Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignUpDto } from './dto/sign-up.dto';
import type { IUserRepository } from 'src/user/interfaces/user-repository.interface';
import { UserModel } from 'src/user/models/user.model';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class AuthService {
  private jwtService: JwtService;
  constructor(
    private readonly moduleRef: ModuleRef,
    @Inject("IUserRepository")
    private userRepository: IUserRepository
  ) {}

  private async getJwtService(): Promise<JwtService> {
    if (!this.jwtService) {
      this.jwtService = this.moduleRef.get(JwtService, {strict: false})
    }
    return this.jwtService;
  }

  private async signToken(user: UserModel): Promise<AuthResponseDto> {
    const jwtService = await this.getJwtService();
    const payload = {
      id: user.id.toString(),
      email: user.email,
    };

    const token = jwtService.sign(payload);

    return {
      id: user.id.toString(),
      token: token,
    };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(signInDto.email)

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(signInDto.password, user.password);

    if (isValid !== true) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.signToken(user)
  }

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(signUpDto.email)
    console.log(user);
    if (user) {
      throw new UnauthorizedException('User existed');
    }

    const encodePassword = await bcrypt.hash(signUpDto.password, 10);

    const newUser = await this.userRepository.create(new UserModel({
      email: signUpDto.email,
      password: encodePassword,
    }))

    if (newUser === null) {
      throw new InternalServerErrorException("Create user failed");
    }

    return await this.signToken(newUser);
  }
}
