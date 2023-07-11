import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma.service";
import { CreateHistoryDto } from "./dto/create-history.dto";

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  async addHistory(createHistoryDto: CreateHistoryDto, id: number) {
    await this.prisma.history.create({
      data: {
        songs: {
          connect: createHistoryDto.songsId.map((songId) => {
            return {
              id: songId
            };
          })
        },
        User: {
          connect: {
            id
          }
        }
      }
    });
    
    return {
      message: "History added"
    };
    
  }
  
  async getHistory(id: number, selectObject: Prisma.HistorySelect = {}) {
    return this.prisma.history.findMany({
      where: {
        User: {
          id
        }
      },
      select: {
        ...selectObject
      }
    });
    
  }
}
