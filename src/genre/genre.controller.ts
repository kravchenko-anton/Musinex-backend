import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { GenreService } from "./genre.service";

@Controller("genre")
export class GenreController {
  constructor(
    private readonly genreService: GenreService
  ) {
  }
  
  @HttpCode(200)
  @Get("/all")
  async getAll() {
    return this.genreService.getAll();
  }
  
  @HttpCode(200)
  @Get("/by-id/:id")
  async getById(@Param("id") id: number) {
    return this.genreService.getById(id);
  }
}
