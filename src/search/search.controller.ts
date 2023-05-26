import { Controller, Get, Param } from "@nestjs/common";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {
  }
  
  
  // global search
  @Get(":query")
  async search(@Param("query") query: string) {
    return this.searchService.search(query);
  }
  
  // get Recommendations page
}
