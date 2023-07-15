"use strict";
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AlbumModule = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../utils/prisma.service");
var album_controller_1 = require("./album.controller");
var album_service_1 = require("./album.service");
var AlbumModule = /** @class */ (function() {
  function AlbumModule() {
  }
  
  AlbumModule = __decorate([
    (0, common_1.Module)({
      controllers: [album_controller_1.AlbumController],
      providers: [album_service_1.AlbumService, prisma_service_1.PrismaService]
    })
  ], AlbumModule);
  return AlbumModule;
}());
exports.AlbumModule = AlbumModule;
