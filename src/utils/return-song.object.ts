import { returnArtistObject } from "../artist/utils/return-artist.object";
import { defaultReturnObject } from "./return-object";

export const returnSongObject = {
  ...defaultReturnObject,
  title: true,
  coverBig: true,
  coverMedium: true,
  coverSmall: true,
  duration: true,
  releaseDate: true,
  mp3Path: true,
  artist: {
    select: returnArtistObject
  }
};


