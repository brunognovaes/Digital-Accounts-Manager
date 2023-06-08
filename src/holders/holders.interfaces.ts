import { Holder } from '@prisma/client';
import { CreateHolderDto } from './dtos/create-holder.dto';

export interface ICreateHolderData extends Omit<CreateHolderDto, 'password'> {}

export interface IHoldersService {
  create(data: ICreateHolderData): Promise<Holder>;
}
