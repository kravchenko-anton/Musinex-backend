import { Controller } from '@nestjs/common';
import { StatiscticService } from './statisctic.service';

@Controller('statisctic')
export class StatiscticController {
  constructor(private readonly statiscticService: StatiscticService) {}
}
