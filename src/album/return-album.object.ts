import { defaultReturnObject } from "../utils/return-object";

export const returnAlbumObject = {
  ...defaultReturnObject,
  title: true,
  coverSmall: true,
  coverMedium: true,
  coverBig: true,
  fans: true,
  releaseDate: true
};
