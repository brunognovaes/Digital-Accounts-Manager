import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  blocked?: boolean;
}
