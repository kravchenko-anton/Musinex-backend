import { Module } from '@nestjs/common';
import { StatiscticService } from './statisctic.service';
import { StatiscticController } from './statisctic.controller';

@Module({
  controllers: [StatiscticController],
  providers: [StatiscticService]
})
export class StatiscticModule {}
