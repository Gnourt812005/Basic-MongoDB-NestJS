import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtService: JwtService
  constructor(
    private readonly moduleRef: ModuleRef,
  ) {}

  private async getJwtService(): Promise<JwtService> {
    if (!this.jwtService) {
      this.jwtService = this.moduleRef.get(JwtService, {strict: false})
    }
    return this.jwtService;
  } 

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    const jwtService = await this.getJwtService()
    try {
      const payload = await jwtService.verifyAsync(token);
      // console.log(payload)
      request['userId'] = payload.id;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
