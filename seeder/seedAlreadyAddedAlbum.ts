import { PrismaClient } from "@prisma/client";

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
      const slugifyName = song.title.replace(/ /g, "-").toLowerCase();
      await page.goto(`https://music.я.ws/search/${slugifyName}`);
      const element = await page.$("#xbody > div > .xtitle");
      if (element) {
        await browser.newPage();
        console.log("Not found in mp3Parser", song.title);
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
        if (!q.title.toLowerCase() === song.title.toLowerCase()) return false;
        return q.song;
      });
      if (!searchSong) {
        await browser.newPage();
        console.log("Not found in mp3 find", song.title);
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
                mp3Path: `https://music.%D1%8F.ws/${searchSong.song}`,
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