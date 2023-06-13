import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTransferDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  accountId: string;

  @IsNotEmpty()
  @IsBoolean()
  credit: boolean;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;
}
