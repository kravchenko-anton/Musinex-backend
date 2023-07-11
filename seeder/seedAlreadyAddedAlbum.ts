import { PrismaClient } from "@prisma/client";
import { mp3Parse } from "./mp3Parse";

const { RateLimit } = require("async-sema");
const puppeteer = require("puppeteer");
const prisma = new PrismaClient();
const colors = require("colors");

const seedAlreadyAddedAlbum = async () => {
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  const albums = await prisma.album.findMany({
    include: {
      artist: true,
      songs: true,
      genre: true
    }
  });
  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];
    const FetchSearchAlbum = await fetch(
      `https://api.deezer.com/search/album?q=${album.title}`
    )
      .then(res => res.json())
      .then(res => (res.data ? res.data[0] : null));
    if (!FetchSearchAlbum) {
      await browser.newPage();
      return console.log(colors.bgRed("Not found album"));
    }
    const FetchSongs = await fetch(
      `https://api.deezer.com/album/${FetchSearchAlbum.id}/tracks`
    ).then(res => res.json());
    if (!FetchSongs) {
      await browser.newPage();
      return console.log(colors.bgRed("Not found songs in album"));
    }
    
    const FetchAlbum = await fetch(
      "https://api.deezer.com/album/" + FetchSearchAlbum.id
    ).then(res => res.json());
    
    const FetchArtist = await fetch(
      "https://api.deezer.com/artist/" + FetchAlbum.artist.id
    ).then(res => res.json());
    if (!FetchArtist.id) {
      await browser.newPage();
      console.log(colors.bgRed("Not found artist id"));
      continue;
    }
    if (!FetchAlbum.id) {
      await browser.newPage();
      console.log(colors.bgRed("Not found album id"));
      continue;
    }
    if (!album.id) {
      await browser.newPage();
      console.log(colors.bgRed("Not found album id"));
      continue;
    }
    const genres = FetchAlbum.genres.data.map(genre => {
      return genre.name;
    });
    const prismaGenres = genres.length > 0 ? genres[0] : "Other";
    if (FetchSongs.length < 3) {
      await browser.newPage();
      console.log(colors.bgRed("FetchSongs.length < 3"));
      continue;
    }
    for (let i = 0; i < FetchSongs.data.length; i++) {
      const song = FetchSongs.data[i];
      const searchSong = await mp3Parse(song.title, browser, page).catch(e => {
        console.log(colors.bgRed.white.bold("Error in mp3Parse" + song.title));
      });
      if (!searchSong) {
        await browser.newPage();
        console.log(colors.bgRed.white.bold("Not found in mp3Parse" + song.title));
        continue;
      }
      if (FetchSongs.data.length < 3) {
        await browser.newPage();
        await prisma.album.delete({
          where: {
            id: album.id
          }
        }).catch(err => {
          browser.newPage();
          console.log(err);
        });
        console.log(colors.bgRed("Remove because FetchSongs.data.length < 3", album.title));
        continue;
      }
      prisma.album.update({
        where: {
          id: album.id
        },
        data: {
          genre: {
            connectOrCreate: {
              where: {
                name: prismaGenres
              },
              create: {
                name: prismaGenres,
                icon: "../assets/genre.png",
                color: "#101010"
              }
            }
          },
          songs: {
            connectOrCreate: {
              where: {
                title: song.title
              },
              create: {
                title: song.title,
                releaseDate: new Date(album.releaseDate),
                duration: song.duration,
                mp3Path: searchSong,
                coverBig: album.coverBig,
                coverMedium: album.coverMedium,
                coverSmall: album.coverSmall,
                genres: {
                  connectOrCreate: {
                    where: {
                      name: prismaGenres
                    },
                    create: {
                      name: prismaGenres,
                      icon: "../assets/genre.png",
                      color: "#101010"
                    }
                  }
                },
                artist: {
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
            }
          }
        }
      }).then(() => {
        browser.newPage();
        console.log(colors.bgGreen(`Added ${song.title}`));
      }).catch(err => {
        browser.newPage();
        console.log(err);
      });
    }
  }
};

const main = async () => {
  console.log(colors.bgCyan("Start seeding..."));
  await seedAlreadyAddedAlbum();
};

main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });