import { IsNotEmpty, IsString } from 'class-validator';
import { IsValidDocument } from 'src/common/validators/document.validator';

export class CreateAccountDto {
  @IsValidDocument()
  @IsString()
  @IsNotEmpty()
  document: string;
}
