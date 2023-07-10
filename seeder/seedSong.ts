import { PrismaClient } from "@prisma/client";

const { RateLimit } = require("async-sema");
const puppeteer = require("puppeteer");
const colors = require("colors");

const prisma = new PrismaClient();

const createSongsFromPopular = async (startIndex: number = 0) => {
  const lim = RateLimit(5);
  const browser = await puppeteer.launch({
    headless: "new"
  });
  const page = await browser.newPage();
  try {
    const search = await fetch(
      "https://api.deezer.com/chart/" + startIndex + "/tracks?limit=1000"
    ).then(res => res.json());
    for (let j = 0; j < search.data.length; j++) {
      await lim();
      const deezer = search.data[j];
      const track = await fetch(
        "https://api.deezer.com/track/" + deezer.id
      ).then(res => res.json());
      
      const artist = await fetch(
        "https://api.deezer.com/artist/" + deezer.artist.id
      ).then(res => res.json());
      
      const album = await fetch(
        "https://api.deezer.com/album/" + deezer.album.id
      ).then(res => res.json());
      const slugifyName = deezer.title.replace(/ /g, "-").toLowerCase();
      
      await page.goto(`https://music.я.ws/search/${slugifyName}`);
      // Error handling for not found
      const element = await page.$("#xbody > div > .xtitle");
      if (element) {
        await browser.newPage();
        console.log("Not found in mp3Parser", deezer.title);
        continue;
      }
      await page.waitForSelector(".playlist .track:nth-child(1)");
      const mp3 = await page.evaluate(() => {
        const quotes = document.querySelectorAll(".track");
        return Array.from(quotes).map((q) => {
          const title = q.querySelector(".playlist-name > em").textContent;
          const author = q.querySelector(".playlist-name > b").textContent;
          const song = q.getAttribute("data-mp3");
          return { title, author, song };
        });
      });
      const searchSong = mp3.find((q) => {
        if (!q.title.toLowerCase() === deezer.title.toLowerCase()) return false;
        return q.song;
      });
      if (!searchSong) {
        await browser.newPage();
        console.log("Not found in mp3 find", deezer.title);
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
          mp3Path: `https://music.%D1%8F.ws/${searchSong.song}`
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
  console.log(colors.bgCyan("Start seeding..."));
  await createSongsFromPopular();
};
main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
