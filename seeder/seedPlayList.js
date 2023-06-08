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
var createPlaylistFromPopular = function (startIndex) {
    if (startIndex === void 0) { startIndex = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var popular, _loop_1, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://api.deezer.com/chart/".concat(startIndex, "/playlists?limit=1000")).then(function (res) { return res.json(); })];
                case 1:
                    popular = _a.sent();
                    if (!popular || !popular.data) {
                        console.log(colors.bgRed("Not found in popular playlists"));
                        return [2 /*return*/];
                    }
                    _loop_1 = function (i) {
                        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
                            var deezer, playlist, songs, j, song, currentSong, artist, album, oldSong, oldPlayList;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        deezer = popular.data[i];
                                        return [4 /*yield*/, fetch("https://api.deezer.com/playlist/".concat(deezer.id)).then(function (res) { return res.json(); })];
                                    case 1:
                                        playlist = _a.sent();
                                        if (!playlist || playlist.error) {
                                            console.log(colors.bgRed("".concat(playlist.error ? "Error in" : "Not found in", " 'playlist' | ").concat(deezer.title, " - title | ").concat(deezer.id, " playlistID | ").concat(i, " songID")));
                                            return [2 /*return*/];
                                        }
                                        songs = playlist.tracks.data;
                                        if (!songs || songs.length === 0) {
                                            console.log(colors.bgRed("Not found in songs"));
                                            return [2 /*return*/];
                                        }
                                        j = 0;
                                        _a.label = 2;
                                    case 2:
                                        if (!(j < songs.length)) return [3 /*break*/, 10];
                                        song = songs[j];
                                        if (!song ||
                                            !song.title ||
                                            !song.duration ||
                                            !song.artist ||
                                            !song.artist.name ||
                                            !song.album ||
                                            !song.album.title ||
                                            !song.album.cover_big ||
                                            !song.album.cover_medium ||
                                            !song.album.cover_small) {
                                            console.log(colors.bgRed("Not found in song ".concat(j, " | ").concat(song.title, " | ").concat(song.duration, " sek")));
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, fetch("https://api.deezer.com/track/".concat(song.id)).then(function (res) { return res.json(); })];
                                    case 3:
                                        currentSong = _a.sent();
                                        if (!currentSong ||
                                            currentSong.error ||
                                            !currentSong.album.id ||
                                            !currentSong.artist.id) {
                                            console.log(colors.bgRed("Not found in currentSong"));
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, fetch("https://api.deezer.com/artist/" + currentSong.artist.id).then(function (res) { return res.json(); })];
                                    case 4:
                                        artist = _a.sent();
                                        return [4 /*yield*/, fetch("https://api.deezer.com/album/" + currentSong.album.id).then(function (res) { return res.json(); })];
                                    case 5:
                                        album = _a.sent();
                                        if (!artist ||
                                            artist.error ||
                                            !album ||
                                            album.error ||
                                            !currentSong ||
                                            currentSong.error ||
                                            !album.genres ||
                                            !album.genres.data[0] ||
                                            !artist.name ||
                                            !album.title) {
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
                                                                : "track", " | ").concat(song.title, "\n\t\t\t\t\t\t\t- title | ").concat(deezer.id, " songID | ").concat(j, " songIndex")));
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, prisma.song.findFirst({
                                                where: {
                                                    title: currentSong.title
                                                }
                                            })];
                                    case 6:
                                        oldSong = _a.sent();
                                        return [4 /*yield*/, prisma.playlist.findFirst({
                                                where: {
                                                    title: deezer.title
                                                }
                                            })];
                                    case 7:
                                        oldPlayList = _a.sent();
                                        if (oldSong || oldPlayList) {
                                            console.log(colors.bgYellow("".concat(oldSong ? "song" : "playlist", " ").concat(j, " | ").concat(deezer.title, " already exists")));
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, prisma.playlist.create({
                                                include: {
                                                    songs: true
                                                },
                                                data: {
                                                    title: playlist.title,
                                                    releaseDate: new Date(playlist.creation_date),
                                                    fans: playlist.fans,
                                                    coverBig: playlist.picture_big,
                                                    coverMedium: playlist.picture_medium,
                                                    coverSmall: playlist.picture_small,
                                                    User: {
                                                        connectOrCreate: {
                                                            where: {
                                                                email: "dreezer@gmail.com"
                                                            },
                                                            create: {
                                                                name: "Deezer",
                                                                email: "dreezer@gmail.com",
                                                                password: "12345678"
                                                            }
                                                        }
                                                    },
                                                    songs: {
                                                        connectOrCreate: {
                                                            where: {
                                                                title: currentSong.title
                                                            },
                                                            create: {
                                                                duration: currentSong.duration,
                                                                title: currentSong.title,
                                                                releaseDate: new Date(currentSong.release_date),
                                                                coverBig: currentSong.album.cover_big,
                                                                coverMedium: currentSong.album.cover_medium,
                                                                coverSmall: currentSong.album.cover_small,
                                                                mp3Path: currentSong.preview,
                                                                albums: {
                                                                    connectOrCreate: {
                                                                        where: {
                                                                            title: album.title
                                                                        },
                                                                        create: {
                                                                            title: album.title,
                                                                            releaseDate: new Date(album.release_date),
                                                                            coverBig: album.cover_big,
                                                                            coverMedium: album.cover_medium,
                                                                            coverSmall: album.cover_small,
                                                                            fans: album.fans
                                                                        }
                                                                    }
                                                                },
                                                                genres: {
                                                                    connectOrCreate: {
                                                                        where: {
                                                                            name: album.genres.data[0].name
                                                                        },
                                                                        create: {
                                                                            name: album.genres.data[0].name,
                                                                            icon: "../assets/genres/genre.icon",
                                                                            color: "#000000"
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
                                                                            pictureMedium: artist.picture_medium,
                                                                            pictureSmall: artist.picture_small,
                                                                            followers: artist.nb_fan
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            })];
                                    case 8:
                                        _a.sent();
                                        console.log(colors.bgGreen("Created playlist ".concat(i, " | ").concat(playlist.title)));
                                        _a.label = 9;
                                    case 9:
                                        j++;
                                        return [3 /*break*/, 2];
                                    case 10: return [2 /*return*/];
                                }
                            });
                        }); }, (i + startIndex) * 500);
                    };
                    for (i = 0; i < popular.data.length; i++) {
                        _loop_1(i);
                    }
                    return [2 /*return*/];
            }
        });
    });
};
var main = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(colors.bgCyan("Start seeding..."));
                return [4 /*yield*/, createPlaylistFromPopular()];
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
