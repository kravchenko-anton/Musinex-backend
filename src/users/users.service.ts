import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { hash } from "argon2";
import { PrismaService } from "../prisma.service";
import { varieties } from "../types/varieties";
import { UserUpdateDto } from "./dto/user.update.dto";
import { returnUserObject } from "./return-user.object";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {
  }
  
  async getById(id: number, selectObject: Prisma.UserSelect = {}) {
    // if !selectObject.id, returnUserObject will be used
    const returnSelectObject = selectObject.id ? { ...selectObject } : { ...returnUserObject };
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...returnSelectObject
      }
    });
    if (!user) throw new BadRequestException("User not found");
    return user;
  }
  
  async updateUser(userId: number, dto: UserUpdateDto) {
    const isSameUser = await this.prisma.user.findUnique({
      where: { email: dto.email }
    });
    
    if (!isSameUser) throw new BadRequestException("User not found");
    
    
    if (isSameUser && isSameUser.id !== userId)
      throw new BadRequestException("User with this email already exists");
    
    const user = await this.getById(userId, {
      password: false
    });
    this.prisma.user.update({
      where: { id: userId },
      data: {
        email: dto.email ? dto.email : user.email,
        password: dto.password ? await hash(dto.password) : user.password,
        avatarPath: dto.avatarPath ? dto.avatarPath : user.avatarPath,
        name: dto.name ? dto.name : user.name
      }
    });
    return user;
  }
  
  async toggleFavorite(userId: number, id: number, type: varieties) {
    const user = await this.getById(+userId);
    
    if (!user) return new BadRequestException("User not found");
    const favoriteType =
      type === "song"
        ? "favoritesSong"
        : type === "album"
          ? "favoritesAlbum"
          : type === "artist"
            ? "favoritesArtist"
            : "favoritesPlaylist";
    
    const isFavorite = user[favoriteType].some(item => item.id === +id);
    await this.prisma.user.update({
      where: { id: +userId },
      data: {
        [favoriteType]: {
          [isFavorite ? "disconnect" : "connect"]: { id: +id }
        }
      }
    });
    return this.getById(+userId);
  }
}
