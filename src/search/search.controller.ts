import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { Auth } from "../auth/decorator/auth.decorator";
import { CurrentUser } from "../auth/decorator/user.decorator";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {
  }
  
  @Auth()
  @HttpCode(200)
  @Get("/catalog")
  async getCatalog(@CurrentUser("id") id: number) {
    return this.searchService.getCatalog(id);
  }
  
  @Get("/:query")
  async search(@Param("query") query: string) {
    return this.searchService.search(query);
  }
  
  
}
