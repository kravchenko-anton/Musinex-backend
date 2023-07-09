const colors = require("colors");
type searchType = "tracks" | "playlists" | "albums" | "artists";
export const SearchEqual = async (type: searchType, maxCount: number) => {
  const playlistCount = [];
  for (let i = 0; i < maxCount; i++) {
    setTimeout(async () => {
      await fetch(`https://api.deezer.com/chart/${i}/${type}?limit=1000`)
        .then(res => res.json())
        .then(res => {
          if (res.total > 70) {
            console.log(colors.bgGreen(`Playlist ${i} | ${res.total}`));
            playlistCount.push({
              i: res.total
            });
          }
        });
    }, i * 200);
  }
  return playlistCount;
};

const main = async () => {
  console.log(colors.bgCyan("Start seeding..."));
  await SearchEqual("tracks", 500);
};


main().catch(e => {
  console.error(e);
});
