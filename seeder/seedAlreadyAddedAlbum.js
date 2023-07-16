"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var colors = require("colors");
var seedAlreadyAddedAlbum = function () { return __awaiter(void 0, void 0, void 0, function () {
    var albums, _loop_1, i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.album.findMany({
                    include: {
                        artist: true,
                        songs: true
                    }
                })];
            case 1:
                albums = _a.sent();
                _loop_1 = function (i) {
                    setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var album, FetchSearchAlbum, FetchSongs, FetchAlbum, FetchArtist, songs, genres, prismaGenres;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    album = albums[i];
                                    return [4 /*yield*/, fetch("https://api.deezer.com/search/album?q=".concat(album.id))
                                            .then(function (res) { return res.json(); })
                                            .then(function (res) { return (res.data ? res.data[0] : null); })];
                                case 1:
                                    FetchSearchAlbum = _a.sent();
                                    if (!FetchSearchAlbum)
                                        return [2 /*return*/, console.log(colors.bgRed("Not found album"))];
                                    return [4 /*yield*/, fetch("https://api.deezer.com/album/".concat(FetchSearchAlbum.id, "/tracks")).then(function (res) { return res.json(); })];
                                case 2:
                                    FetchSongs = _a.sent();
                                    if (!FetchSongs) {
                                        return [2 /*return*/, console.log(colors.bgRed("Not found songs in album"))];
                                    }
                                    return [4 /*yield*/, fetch("https://api.deezer.com/album/" + FetchSearchAlbum.id).then(function (res) { return res.json(); })];
                                case 3:
                                    FetchAlbum = _a.sent();
                                    return [4 /*yield*/, fetch("https://api.deezer.com/artist/" + FetchAlbum.artist.id).then(function (res) { return res.json(); })];
                                case 4:
                                    FetchArtist = _a.sent();
                                    songs = FetchSongs.data.map(function (song) {
                                        return {
                                            title: song.title,
                                            releaseDate: new Date(FetchAlbum.release_date),
                                            duration: song.duration,
                                            mp3Path: song.preview,
                                            coverBig: FetchAlbum.cover_big,
                                            coverMedium: FetchAlbum.cover_medium,
                                            coverSmall: FetchAlbum.cover_small
                                        };
                                    });
                                    // Me need push songs to album songs
                                    if (!FetchArtist.id)
                                        return [2 /*return*/, console.log(colors.bgRed("Not found artist"))];
                                    if (!FetchAlbum.id)
                                        return [2 /*return*/, console.log(colors.bgRed("Not found album"))];
                                    if (!album.id)
                                        return [2 /*return*/, console.log(colors.bgRed("Not found album id"))];
                                    if (!songs)
                                        return [2 /*return*/, console.log(colors.bgRed("Not found songs"))];
                                    genres = FetchAlbum.genres.data.map(function (genre) {
                                        return genre.name;
                                    });
                                    prismaGenres = genres.length > 0 ? genres[0] : "Other";
                                    console.log(colors.bgGreen("Found album, ".concat(prismaGenres)));
                                    prisma.album
                                        .update({
                                        where: {
                                            id: album.id
                                        },
                                        data: {
                                            songs: {
                                                connectOrCreate: songs.map(function (song) {
                                                    return {
                                                        where: {
                                                            title: song.title
                                                        },
                                                        create: {
                                                            title: song.title,
                                                            releaseDate: song.releaseDate,
                                                            duration: song.duration,
                                                            mp3Path: song.mp3Path,
                                                            coverBig: song.coverBig,
                                                            coverMedium: song.coverMedium,
                                                            coverSmall: song.coverSmall,
                                                            genres: {
                                                                connectOrCreate: {
                                                                    where: {
                                                                        name: prismaGenres
                                                                    },
                                                                    create: {
                                                                        name: prismaGenres,
                                                                        icon: "genre.png",
                                                                        color: "#101010"
                                                                    }
                                                                }
                                                            },
                                                            artists: {
                                                                connectOrCreate: {
                                                                    where: {
                                                                        name: FetchArtist.name
                                                                    },
                                                                    create: {
                                                                        name: FetchArtist.name,
                                                                        pictureBig: FetchArtist.picture_big,
                                                                        pictureSmall: FetchArtist.picture_small,
                                                                        pictureMedium: FetchArtist.picture_medium,
                                                                        followers: FetchArtist.nb_fan
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    };
                                                })
                                            }
                                        }
                                    })
                                        .then(function (res) {
                                        return console.log(colors.bgGreen("Success update album | ".concat(res.title)));
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); }, i * 1000);
                };
                for (i = 0; i < albums.length; i++) {
                    _loop_1(i);
                }
                return [2 /*return*/];
        }
    });
}); };
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(colors.bgCyan("Start seeding..."));
                return [4 /*yield*/, seedAlreadyAddedAlbum()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
main()["catch"](function (e) {
    console.error(e);
})["finally"](function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
