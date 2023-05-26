import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const colors = require("colors");

const seedAlreadyAddedAlbum = async () => {
  const albums = await prisma.album.findMany({
    include: {
      artist: true,
      songs: true
    }
  });
  for (let i = 0; i < albums.length; i++) {
    setTimeout(async () => {
      const album = albums[i];
      const FetchSearchAlbum = await fetch(
        `https://api.deezer.com/search/album?q=${album.id}`
      )
        .then(res => res.json())
        .then(res => (res.data ? res.data[0] : null));
      if (!FetchSearchAlbum) return console.log(colors.bgRed("Not found album"));
      const FetchSongs = await fetch(
        `https://api.deezer.com/album/${FetchSearchAlbum.id}/tracks`
      ).then(res => res.json());
      
      if (!FetchSongs) {
        return console.log(colors.bgRed("Not found songs in album"));
      }
      
      const FetchAlbum = await fetch(
        "https://api.deezer.com/album/" + FetchSearchAlbum.id
      ).then(res => res.json());
      
      const FetchArtist = await fetch(
        "https://api.deezer.com/artist/" + FetchAlbum.artist.id
      ).then(res => res.json());
      
      const songs = FetchSongs.data.map(song => {
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
      if (!FetchArtist.id) return console.log(colors.bgRed("Not found artist"));
      if (!FetchAlbum.id) return console.log(colors.bgRed("Not found album"));
      if (!album.id) return console.log(colors.bgRed("Not found album id"));
      if (!songs) return console.log(colors.bgRed("Not found songs"));
      
      const genres = FetchAlbum.genres.data.map(genre => {
        return genre.name;
      });
      const prismaGenres = genres.length > 0 ? genres[0] : "Other";
      console.log(colors.bgGreen(`Found album, ${prismaGenres}`));
      prisma.album
        .update({
          where: {
            id: album.id
          },
          data: {
            songs: {
              connectOrCreate: songs.map(song => {
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
                          name: prismaGenres
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
        .then(res =>
          console.log(colors.bgGreen(`Success update album | ${res.title}`))
        );
    }, i * 1000);
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