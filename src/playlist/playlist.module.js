"use strict";
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PlaylistModule = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../utils/prisma.service");
var playlist_controller_1 = require("./playlist.controller");
var playlist_service_1 = require("./playlist.service");
var PlaylistModule = /** @class */ (function() {
  function PlaylistModule() {
  }
  
  PlaylistModule = __decorate([
    (0, common_1.Module)({
      controllers: [playlist_controller_1.PlaylistController],
      providers: [playlist_service_1.PlaylistService, prisma_service_1.PrismaService]
    })
  ], PlaylistModule);
  return PlaylistModule;
}());
exports.PlaylistModule = PlaylistModule;
