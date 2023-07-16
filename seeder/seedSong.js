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
var colors = require("colors");
var prisma = new client_1.PrismaClient();
var createSongsFromPopular = function (startIndex) {
    if (startIndex === void 0) { startIndex = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var search_1, _loop_1, j, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch("https://api.deezer.com/chart/" + startIndex + "/tracks?limit=1000").then(function (res) { return res.json(); })];
                case 1:
                    search_1 = _a.sent();
                    _loop_1 = function (j) {
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var deezer, track, artist, album, oldSong;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        deezer = search_1.data[j];
                                        return [4 /*yield*/, fetch("https://api.deezer.com/track/" + deezer.id).then(function (res) { return res.json(); })];
                                    case 1:
                                        track = _a.sent();
                                        return [4 /*yield*/, fetch("https://api.deezer.com/artist/" + deezer.artist.id).then(function (res) { return res.json(); })];
                                    case 2:
                                        artist = _a.sent();
                                        return [4 /*yield*/, fetch("https://api.deezer.com/album/" + deezer.album.id).then(function (res) { return res.json(); })];
                                    case 3:
                                        album = _a.sent();
                                        if (!artist ||
                                            artist.error ||
                                            !album ||
                                            album.error ||
                                            !track ||
                                            track.error ||
                                            !album.genres ||
                                            !album.genres.data[0] ||
                                            !artist.name ||
                                            !album.title ||
                                            !deezer.title) {
                                            console.log(colors.bgRed("".concat(artist.error ? "Error in" : "Not found in", " ").concat(!artist
                                                ? "artist"
                                                : !album
                                                    ? "album"
                                                    : !album.genres
                                                        ? "album genres"
                                                        : !artist.name
                                                            ? "artist name"
                                                            : !album.title
                                                                ? "album title"
                                                                : !deezer.title
                                                                    ? "deezer title"
                                                                    : "track", " | ").concat(deezer.title, "\n\t\t\t\t\t\t\t- title | ").concat(deezer.id, " songID | ").concat(j, " songIndex")));
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, prisma.song.findFirst({
                                                where: {
                                                    title: deezer.title
                                                }
                                            })];
                                    case 4:
                                        oldSong = _a.sent();
                                        if (oldSong) {
                                            console.log(colors.bgYellow("Song ".concat(j, " | ").concat(deezer.title, " already exists")));
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, prisma.song.create({
                                                include: {
                                                    genres: true,
                                                    albums: true
                                                },
                                                data: {
                                                    duration: deezer.duration,
                                                    title: deezer.title,
                                                    genres: {
                                                        connectOrCreate: {
                                                            where: {
                                                                name: album.genres.data[0].name
                                                            },
                                                            create: {
                                                                name: album.genres.data[0].name,
                                                                color: "#101010",
                                                                icon: "genre.png"
                                                            }
                                                        }
                                                    },
                                                    releaseDate: new Date(track.release_date),
                                                    albums: {
                                                        connectOrCreate: {
                                                            where: {
                                                                title: album.title
                                                            },
                                                            create: {
                                                                title: album.title,
                                                                coverBig: album.cover_big,
                                                                coverMedium: album.cover_medium,
                                                                coverSmall: album.cover_small,
                                                                releaseDate: new Date(album.release_date),
                                                                fans: album.fans,
                                                                artist: {
                                                                    connectOrCreate: {
                                                                        where: {
                                                                            name: artist.name
                                                                        },
                                                                        create: {
                                                                            name: artist.name,
                                                                            pictureBig: artist.picture_big,
                                                                            pictureSmall: artist.picture_small,
                                                                            pictureMedium: artist.picture_medium,
                                                                            followers: artist.nb_fan
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    artists: {
                                                        connectOrCreate: {
                                                            where: {
                                                                name: artist.name
                                                            },
                                                            create: {
                                                                name: artist.name,
                                                                pictureBig: artist.picture_big,
                                                                pictureSmall: artist.picture_small,
                                                                pictureMedium: artist.picture_medium,
                                                                followers: artist.nb_fan
                                                            }
                                                        }
                                                    },
                                                    coverBig: deezer.album.cover_big,
                                                    coverMedium: deezer.album.cover_medium,
                                                    coverSmall: deezer.album.cover_small,
                                                    mp3Path: deezer.preview
                                                }
                                            })];
                                    case 5:
                                        _a.sent();
                                        console.log(colors.bgGreen("Created song ".concat(j, " | ").concat(deezer.title)));
                                        return [2 /*return*/];
                                }
                            });
                        }); }, (j + startIndex) * 250);
                    };
                    for (j = 0; j < search_1.data.length; j++) {
                        _loop_1(j);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(colors.bgRed("Error:" + error_1));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(colors.bgCyan("Start seeding..."));
                return [4 /*yield*/, createSongsFromPopular()];
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
