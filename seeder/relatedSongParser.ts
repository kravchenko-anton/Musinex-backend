import { PrismaClient } from "@prisma/client";
import { mp3Parse } from "./mp3Parse";

const { RateLimit } = require("async-sema");
const colors = require("colors");
const puppeteer = require("puppeteer");
const prisma = new PrismaClient();
export const relatedSongParser = async (name: string): Promise<{ title: string, author: string }[]> => {
  const browser = await puppeteer.launch({ headless: "new", ignoreHTTPSErrors: true });
  const page = await browser.newPage();
  await page.goto(`https://www.chosic.com/playlist-generator/`);
  await page.waitForSelector(".css-47sehv");
  await page.click(".css-47sehv");
  await page.waitForSelector("#search-word");
  await page.type("#search-word", name);
  await page.waitForSelector("#form-suggestions > #hh1");
  await page.click("#form-suggestions > #hh1");
  await page.click("#generate-button");
  await page.waitForSelector(".all-suggests > .song-div:nth-child(1)");
  return await page.evaluate(() => {
    const quotes = document.querySelectorAll(".song-div");
    return Array.from(quotes).map((q) => {
      const title = q.querySelector(".track-list-item-info-text > div > a").textContent;
      const author = q.querySelector(".track-list-item-info-genres > p").textContent;
      return { title, author };
    });
  });
};
// prisma loop for get all songs

const parseAllRelatedSongs = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  const songs = await prisma.song.findMany({
    include: {
      genres: true,
      relatedSongs: true,
      albums: true,
      artist: true,
      playlists: true
    }
  });
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    if (song.relatedSongs.length > 0) {
      console.log(colors.bgYellow.bold("Already parsed " + song.title));
      continue;
    }
    const relatedSongs = await relatedSongParser(song.title);
    let relatedSongsLength = 0;
    for (let j = 0; j < relatedSongs.length; j++) {
      const pages = await browser.pages();
      if (pages.length >= 3) {
        pages.map(async (p) => p.url() === "about:blank" && await p.close());
      }
      const relatedSong = relatedSongs[j];
      const deezerSearch = await fetch(
        "https://api.deezer.com/search?q=" + relatedSong.title
      ).then(res => res.json());
      if (deezerSearch.total === 0 || !deezerSearch.data[0].id) {
        console.log("Not found in deezer", relatedSong.title);
        continue;
      }
      const dreezieSong = await fetch(
        "https://api.deezer.com/track/" + deezerSearch.data[0].id
      ).then(res => res.json());
      if (!dreezieSong) {
        console.log("Not found in deezer", relatedSong.title);
        continue;
      }
      const artist = await fetch(
        "https://api.deezer.com/artist/" + dreezieSong.artist.id
      ).then(res => res.json());
      
      const album = await fetch(
        "https://api.deezer.com/album/" + dreezieSong.album.id
      ).then(res => res.json());
      const searchSong = await mp3Parse(relatedSong.title,
        dreezieSong.duration
        , browser, page);
      if (!searchSong) {
        await browser.newPage();
        console.log(colors.bgRed("Not found in mp3 " + relatedSong.title));
        continue;
      }
      if (
        !artist ||
        artist.error ||
        !album ||
        album.error ||
        !dreezieSong ||
        dreezieSong.error ||
        !album.genres ||
        !album.genres.data[0] ||
        !artist.name ||
        !album.title ||
        !dreezieSong.title
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
                        : !dreezieSong.title
                          ? "deezer title"
                          : "track"
            } | ${dreezieSong.title}
							- title | ${dreezieSong.id} songID | ${j} songIndex`
          )
        );
        continue;
      }
      const oldSong = await prisma.song.findFirst({
        where: {
          title: dreezieSong.title
        },
        include: {
          relatedSongs: true
        }
      });
      
      if (relatedSong.title == song.title) {
        await browser.newPage();
        console.log(colors.bgYellow(`Song ${dreezieSong.title} it self`));
        continue;
      }
      
      
      if (oldSong) {
        relatedSongsLength++;
        await browser.newPage();
        await prisma.song.update({
          where: {
            title: song.title
          },
          data: {
            relatedSongs: {
              connect: {
                title: dreezieSong.title
              }
            }
          }
        });
        console.log(colors.bgBlue(`Song ${dreezieSong.title}  connected`));
        continue;
      }
      
      if (relatedSongsLength >= 5) {
        console.log(colors.bgRed("Song " + song.title + " has more than 5 related songs"));
        break;
      }
      await prisma.song.create({
        include: {
          genres: true
        },
        data: {
          title: dreezieSong.title,
          duration: dreezieSong.duration,
          mp3Path: searchSong,
          coverBig: dreezieSong.album.cover_big,
          coverMedium: dreezieSong.album.cover_medium,
          coverSmall: dreezieSong.album.cover_small,
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
          releaseDate: new Date(dreezieSong.release_date),
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
                pictureMedium: artist.picture_medium,
                pictureSmall: artist.picture_small,
                followers: artist.nb_fan
              }
            }
          }
          
          
        }
      });
      
      await prisma.song.update({
        include: {
          relatedSongs: true
        },
        where: {
          id: song.id
        },
        data: {
          relatedSongs: {
            connect: {
              title: dreezieSong.title
            }
          }
        }
      });
      relatedSongsLength++;
      await browser.newPage();
      console.log(
        colors.bgGreen(`Song ${j} | ${dreezieSong.title} successfully added`)
      );
    }
  }
};

parseAllRelatedSongs().then(() => {
  console.log("done");
  process.exit(0);
});