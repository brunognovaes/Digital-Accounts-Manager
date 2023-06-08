import { Injectable } from '@nestjs/common';
import { ICreateHolderData, IHoldersService } from './holders.interfaces';
import { Holder } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import holdersErrors from './holders.errors';

@Injectable()
export class HoldersService implements IHoldersService {
  constructor(private prismaService: PrismaService) {}

  async create(data: ICreateHolderData): Promise<Holder> {
    const alreadyRegistered = await this.prismaService.holder.findUnique({
      where: {
        document: data.document,
      },
    });

    if (alreadyRegistered) {
      throw holdersErrors.ALREADY_REGISTERED;
    }

    const holder = await this.prismaService.holder.create({
      data,
    });

    return holder;
  }
}
