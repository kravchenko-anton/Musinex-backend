import { Controller, Get, HttpCode } from "@nestjs/common";
import { PlaylistService } from "./playlist.service";

@Controller("playlist")
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {
  }
  
  @HttpCode(200)
  @Get(":id")
  async getPlaylistById(id: number) {
    return this.playlistService.getPlaylistById(id);
  }
}
