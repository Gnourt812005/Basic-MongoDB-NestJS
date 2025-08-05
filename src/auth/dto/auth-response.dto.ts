import { IsString } from 'class-validator';

// export class UserInfo {
//   @IsString()
//   id: string;

//   @IsString()
//   email: string;
// }

export class AuthResponseDto {
  // user: UserInfo;
  @IsString()
  email: string 

  @IsString()
  token: string;
}
