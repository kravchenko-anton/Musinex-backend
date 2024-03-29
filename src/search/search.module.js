"use strict";
var __decorate = (this && this.__decorate) || function(decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SearchModule = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../utils/prisma.service");
var search_controller_1 = require("./search.controller");
var search_service_1 = require("./search.service");
var SearchModule = /** @class */ (function() {
  function SearchModule() {
  }
  
  SearchModule = __decorate([
    (0, common_1.Module)({
      controllers: [search_controller_1.SearchController],
      providers: [search_service_1.SearchService, prisma_service_1.PrismaService]
    })
  ], SearchModule);
  return SearchModule;
}());
exports.SearchModule = SearchModule;
