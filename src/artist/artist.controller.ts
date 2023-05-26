import { Controller, Get, HttpCode } from "@nestjs/common";
import { ArtistService } from "./artist.service";

@Controller("artist")
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {
  }
  
  @HttpCode(200)
  @Get(":id")
  async getArtistById(id: number) {
    return this.artistService.getArtistById(id);
  }
  
}
