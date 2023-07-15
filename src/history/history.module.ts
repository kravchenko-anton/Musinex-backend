import { Module } from "@nestjs/common";
import { PrismaService } from "../utils/prisma.service";
import { HistoryController } from "./history.controller";
import { HistoryService } from "./history.service";

@Module({
  controllers: [HistoryController],
  providers: [HistoryService, PrismaService],
  exports: [HistoryService]
})
export class HistoryModule {
}
