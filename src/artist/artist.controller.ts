import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { ArtistService } from "./artist.service";

@Controller("artist")
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {
  }
  
  @HttpCode(200)
  @Get("/:id")
  async getArtistById(@Param("id") id: number) {
    return this.artistService.getArtistById(id);
  }
  
}
