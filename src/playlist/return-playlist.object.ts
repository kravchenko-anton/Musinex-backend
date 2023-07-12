import { defaultReturnObject } from "../utils/return-object";

export const returnPlaylistObject = {
  ...defaultReturnObject,
  title: true,
  coverMedium: true,
  coverBig: true,
  coverSmall: true,
  fans: true,
  releaseDate: true
};
