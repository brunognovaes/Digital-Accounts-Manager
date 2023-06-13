import { Prisma } from '@prisma/client';

export interface IFilterQueryMetadataResponse {
  currentItems: number;
  order: Prisma.SortOrder;
  page: number;
  maxPage: number;
}

export interface IPaginatedResponse<T> {
  values: T[];
  metadata: IFilterQueryMetadataResponse;
}
