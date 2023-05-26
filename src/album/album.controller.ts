import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { AlbumService } from "./album.service";

@Controller("album")
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {
  }
  
  @HttpCode(200)
  @Get(":id")
  async getAlbumById(@Param("id") id: number) {
    return this.albumService.getAlbumById(id);
  }
  
  
}
