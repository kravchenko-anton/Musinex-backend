import { Body, Controller, Get, HttpCode, Post } from "@nestjs/common";
import { Auth } from "../auth/decorator/auth.decorator";
import { CurrentUser } from "../auth/decorator/user.decorator";
import { CreateHistoryDto } from "./dto/create-history.dto";
import { HistoryService } from "./history.service";

@Controller("history")
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {
  }
  
  @HttpCode(200)
  @Auth()
  @Post("/add")
  addHistory(@Body() createHistoryDto: CreateHistoryDto, @CurrentUser("id") id: number) {
    return this.historyService.addHistory(createHistoryDto, id);
  }
  
  @HttpCode(200)
  @Auth()
  @Get("/get")
  getHistory(@CurrentUser("id") id: number) {
    return this.historyService.getHistory(id);
  }
}
