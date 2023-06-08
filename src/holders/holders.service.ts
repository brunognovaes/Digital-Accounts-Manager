import { Injectable } from '@nestjs/common';
import { ICreateHolderData, IHoldersService } from './holders.interfaces';
import { Holder } from '@prisma/client';

@Injectable()
export class HoldersService implements IHoldersService {
  create(data: ICreateHolderData): Promise<Holder> {
    throw new Error('Method not implemented.');
  }
}
