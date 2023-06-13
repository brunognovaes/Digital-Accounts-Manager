import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateTransferDto {
  @IsNotEmpty()
  @IsBoolean()
  credit: boolean

  @IsNotEmpty()
  @IsNumber({maxDecimalPlaces: 2})
  amount: number

  @IsOptional()
  @IsString()
  message?: string
}