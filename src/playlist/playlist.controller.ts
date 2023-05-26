import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { PlaylistService } from "./playlist.service";

@Controller("playlist")
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {
  }
  
  @HttpCode(200)
  @Get("/:id")
  async getPlaylistById(@Param("id") id: number) {
    return this.playlistService.getPlaylistById(id);
  }
}
