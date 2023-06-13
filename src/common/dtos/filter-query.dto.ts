import { Prisma } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';
export const isValidStringDateRegex =
  /^([0-9]{4}[-\/]?((0[13-9]|1[012])[-\/]?(0[1-9]|[12][0-9]|30)|(0[13578]|1[02])[-\/]?31|02[-\/]?(0[1-9]|1[0-9]|2[0-8]))|([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00)[-\/]?02[-\/]?29)$/;

export class FilterQueryDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(150)
  itemsPerPage = 10;

  @IsString()
  @IsOptional()
  @IsEnum(Prisma.SortOrder)
  order = Prisma.SortOrder.desc;

  @IsOptional()
  @IsNumber()
  @Min(0)
  page = 0;

  @IsString()
  @IsOptional()
  @Matches(isValidStringDateRegex, {
    message: 'Start date must match pattern yyyy-mm-dd.',
  })
  startDate?: string;

  @IsString()
  @IsOptional()
  @Matches(isValidStringDateRegex, {
    message: 'Start date must match pattern yyyy-mm-dd.',
  })
  endDate?: string;
}
