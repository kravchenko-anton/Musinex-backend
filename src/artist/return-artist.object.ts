import { defaultReturnObject } from "../utils/return-object";

export const returnArtistObject = {
  ...defaultReturnObject,
  name: true,
  followers: true,
  pictureBig: true,
  pictureMedium: true,
  pictureSmall: true
};
