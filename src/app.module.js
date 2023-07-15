"use strict";

var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var serve_static_1 = require("@nestjs/serve-static");
var path_1 = require("path");
var album_module_1 = require("./album/album.module");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var artist_module_1 = require("./artist/artist.module");
var auth_module_1 = require("./auth/auth.module");
var genre_module_1 = require("./genre/genre.module");
var playlist_module_1 = require("./playlist/playlist.module");
var prisma_service_1 = require("./utils/prisma.service");
var search_module_1 = require("./search/search.module");
var users_module_1 = require("./users/users.module");
var AppModule = /** @class */ (function() {
  function AppModule() {
  }
  
  AppModule = __decorate([
    (0, common_1.Module)({
      imports: [config_1.ConfigModule.forRoot(), serve_static_1.ServeStaticModule.forRoot({
        rootPath: (0, path_1.join)(__dirname, "..")
      }), users_module_1.UsersModule, auth_module_1.AuthModule, playlist_module_1.PlaylistModule, album_module_1.AlbumModule, artist_module_1.ArtistModule, genre_module_1.GenreModule, search_module_1.SearchModule],
      controllers: [app_controller_1.AppController],
      providers: [app_service_1.AppService, prisma_service_1.PrismaService]
    })
  ], AppModule);
  return AppModule;
}());
exports.AppModule = AppModule;
