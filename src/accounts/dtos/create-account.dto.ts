import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  holder_id: string;
}
