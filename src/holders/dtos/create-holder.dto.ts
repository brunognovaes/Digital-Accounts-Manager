import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  MaxLength,
} from 'class-validator';
import { IsValidDocument } from 'src/common/validators/document.validator';

export class CreateHolderDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsValidDocument()
  document: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 16)
  password: string;
}
