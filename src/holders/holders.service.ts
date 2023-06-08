import { Injectable } from '@nestjs/common';
import { ICreateHolderData, IHoldersService } from './holders.interfaces';
import { Holder } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import holdersErrors from './holders.errors';

@Injectable()
export class HoldersService implements IHoldersService {
  constructor(private prismaService: PrismaService) {}

  async delete(id: string): Promise<void> {
    const holder = await this.prismaService.holder.findUnique({
      where: {
        id,
      },
    });

    if (!holder) {
      throw holdersErrors.NOT_FOUND;
    }

    await this.prismaService.holder.delete({
      where: {
        id,
      },
    });
  }

  async getByDocument(document: string): Promise<Holder> {
    const holder = await this.prismaService.holder.findUnique({
      where: { document },
    });

    if (!holder) {
      throw holdersErrors.NOT_FOUND;
    }

    return holder;
  }

  async getById(id: string): Promise<Holder> {
    const holder = await this.prismaService.holder.findUnique({
      where: { id },
    });

    if (!holder) {
      throw holdersErrors.NOT_FOUND;
    }

    return holder;
  }

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
