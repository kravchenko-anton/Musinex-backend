import colors from "colors";

type searchType = "albums" | "artists" | "tracks" | "playlists";
export const SearchEqual = async (type: searchType, maxCount: number) => {
  const playlistCount = [];
  for (let i = 0; i < maxCount; i++) {
    await fetch(`https://api.deezer.com/chart/${i}/${type}?limit=1000`)
      .then(res => res.json())
      .then(res => {
        if (res.total > 90) {
          console.log(colors.bgGreen(`${type} ${i} | ${res.total}`));
          playlistCount.push({
            i: res.total
          });
        }
      });
  }
  return playlistCount;
};
export const getAllSongs = async (type: searchType, maxCount: number) => {
  const result = [];
  const res = await SearchEqual(type, maxCount);
  for (let r = 0; r < res.length; r++) {
    const search = await fetch(
      "https://api.deezer.com/chart/" + r + "/tracks?limit=1000"
    ).then(res => res.json());
    for (let j = 0; j < search.data.length; j++) {
      result.push(search.data[j]);
    }
  }
  return result;
};