import { PrismaClient } from "@prisma/client";
import { mp3Parse } from "./mp3Parse";

const colors = require("colors");

const prisma = new PrismaClient();

const { RateLimit } = require("async-sema");
const puppeteer = require("puppeteer");


const createPlaylistFromPopular = async (startIndex: number = 0) => {
  const lim = RateLimit(1);
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  const popular = await fetch(
    `https://api.deezer.com/chart/${startIndex}/playlists?limit=1000`
  ).then(res => res.json());
  
  if (!popular || !popular.data) {
    console.log(colors.bgRed("Not found in popular playlists"));
  }
  for (let i = 0; i < popular.data.length; i++) {
    const deezer = popular.data[i];
    const playlist = await fetch(
      `https://api.deezer.com/playlist/${deezer.id}`
    ).then(res => res.json());
    
    if (!playlist || playlist.error) {
      await browser.newPage();
      console.log(
        colors.bgRed(
          `${playlist.error ? "Error in" : "Not found in"} 'playlist' | ${
            deezer.title
          } - title | ${deezer.id} playlistID | ${i} songID`
        )
      );
      continue;
    }
    
    const songs = playlist.tracks.data;
    
    if (!songs || songs.length < 3) {
      await browser.newPage();
      console.log(colors.bgRed(`Not found in songs`));
      continue;
    }
    const oldPlaylist = await prisma.playlist.findFirst({
      where: {
        title: playlist.title
      }
    });
    if (oldPlaylist) {
      await browser.newPage();
      console.log(colors.bgRed(`Already added playlist`));
      continue;
    }
    // Create playlist
    await prisma.playlist.create({
      include: {
        genres: true,
        songs: true
      },
      data: {
        title: playlist.title,
        releaseDate: new Date(playlist.creation_date),
        fans: playlist.fans,
        coverBig: playlist.picture_big,
        coverMedium: playlist.picture_medium,
        coverSmall: playlist.picture_small
      }
    });
    
    for (let j = 0; j < songs.length; j++) {
      await lim();
      const song = songs[j];
      const searchSong = await mp3Parse(song.title, song.duration, browser, page).catch(e => {
        console.log(colors.bgRed.white.bold("Error in mp3Parse " + song.title + " " + e));
      });
      if (!searchSong) {
        await browser.newPage();
        console.log(colors.bgRed.white.bold("Not found in mp3Parse " + song.title));
        continue;
      }
      if (
        !song ||
        !song.title ||
        !song.duration ||
        !song.artist ||
        !song.artist.name ||
        !song.album ||
        !song.album.title ||
        !song.album.cover_big ||
        !song.album.cover_medium ||
        !song.album.cover_small
      ) {
        await browser.newPage();
        console.log(
          colors.bgRed(
            `Not found in song ${j} | ${song.title} | ${song.duration} sek`
          )
        );
        continue;
      }
      const currentSong = await fetch(
        `https://api.deezer.com/track/${song.id}`
      ).then(res => res.json());
      
      if (
        !currentSong ||
        currentSong.error ||
        !currentSong.album.id ||
        !currentSong.artist.id
      ) {
        await browser.newPage();
        console.log(colors.bgRed(`Not found in currentSong`));
        continue;
      }
      
      const artist = await fetch(
        "https://api.deezer.com/artist/" + currentSong.artist.id
      ).then(res => res.json());
      
      const album = await fetch(
        "https://api.deezer.com/album/" + currentSong.album.id
      ).then(res => res.json());
      
      if (
        !artist ||
        artist.error ||
        !album ||
        album.error ||
        !currentSong ||
        currentSong.error ||
        !album.genres ||
        !album.genres.data[0] ||
        !artist.name ||
        !album.title
      ) {
        await browser.newPage();
        console.log(
          colors.bgRed(
            `${artist.error ? "Error in" : "Not found in"} ${
              !artist
                ? "artist"
                : !album
                  ? "album"
                  : !album.genres
                    ? "album genres"
                    : !artist.name
                      ? "artist name"
                      : !album.title
                        ? "album title"
                        : "track"
            } | ${song.title} | ${deezer.id}id | ${j} index`
          )
        );
        continue;
      }
      const genres = album.genres.data.map(genre => {
        return genre.name;
      });
      const prismaGenres = genres.length > 0 ? genres[0] : "Other";
      if (!prismaGenres) {
        await browser.newPage();
        console.log(colors.bgRed(`Not found in prismaGenres`));
        continue;
      }
      await prisma.playlist.update({
        include: {
          songs: true,
          genres: true
        },
        where: {
          title: playlist.title
        },
        data: {
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
                mp3Path: searchSong,
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
                      fans: album.fans,
                      artist: {
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
                },
                genres: {
                  connectOrCreate: {
                    where: {
                      name: album.genres.data[0].name
                    },
                    create: {
                      name: album.genres.data[0].name,
                      icon: "genre.png",
                      color: "#000000"
                    }
                  }
                },
                artist: {
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
      });
      await browser.newPage();
      console.log(colors.bgGreen(`Created playlist ${i} | ${playlist.title} | ${
        song.title
      }`));
    }
  }
};
const main = async () => {
  console.log(colors.bgCyan("Start seeding..."));
  await createPlaylistFromPopular();
};
main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
