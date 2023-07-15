import { PrismaClient } from "@prisma/client";
import { getAllSongs } from "./getAllDreezerSongs";
import { mp3Parse } from "./mp3Parse";

const { RateLimit } = require("async-sema");
const puppeteer = require("puppeteer");
const colors = require("colors");


const prisma = new PrismaClient();

const createSongsFromPopular = async () => {
  const lim = RateLimit(2);
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  try {
    const search = await getAllSongs("tracks", 50);
    for (let j = 0; j < search.length; j++) {
      await lim();
      const deezer = search[j];
      const track = await fetch(
        "https://api.deezer.com/track/" + deezer.id
      ).then(res => res.json());
      
      const artist = await fetch(
        "https://api.deezer.com/artist/" + deezer.artist.id
      ).then(res => res.json());
      
      const album = await fetch(
        "https://api.deezer.com/album/" + deezer.album.id
      ).then(res => res.json());
      const searchSong = await mp3Parse(deezer.title, deezer.duration, browser, page);
      if (!searchSong) {
        await browser.newPage();
        console.log(colors.bgRed.white.bold("Not found in mp3Parse" + deezer.title));
        continue;
      }
      if (
        !artist ||
        artist.error ||
        !album ||
        album.error ||
        !track ||
        track.error ||
        !album.genres ||
        !album.genres.data[0] ||
        !artist.name ||
        !album.title ||
        !deezer.title
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
                        : !deezer.title
                          ? "deezer title"
                          : "track"
            } | ${deezer.title}
							- title | ${deezer.id} songID | ${j} songIndex`
          )
        );
        continue;
      }
      
      const oldSong = await prisma.song.findFirst({
        where: {
          title: deezer.title
        }
      });
      
      if (oldSong) {
        await browser.newPage();
        console.log(
          colors.bgYellow(`Song ${j} | ${deezer.title} already exists`)
        );
        continue;
      }
      await prisma.song.create({
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
                icon: "../assets/genre.png"
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
          },
          coverBig: deezer.album.cover_big,
          coverMedium: deezer.album.cover_medium,
          coverSmall: deezer.album.cover_small,
          mp3Path: searchSong
        }
      });
      await browser.newPage();
      console.log(colors.bgGreen(`Created song ${j} | ${deezer.title}`));
      
    }
  } catch (error) {
    await browser.newPage();
    return console.error(colors.bgRed("Error:" + error));
  }
};
const main = async () => {
  await createSongsFromPopular();
};
main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
