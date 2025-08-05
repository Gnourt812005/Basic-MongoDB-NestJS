import { IsString } from 'class-validator';

// export class UserInfo {
//   @IsString()
//   id: string;

//   @IsString()
//   email: string;
// }

export class AuthResponseDto {
  @IsString()
  id: string;

  @IsString()
  token: string;
}
