import { Controller, Get, HttpCode } from "@nestjs/common";
import { AlbumService } from "./album.service";

@Controller("album")
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {
  }
  
  @HttpCode(200)
  @Get(":id")
  async getAlbumById(id: number) {
    return this.albumService.getAlbumById(id);
  }
  
  
}
