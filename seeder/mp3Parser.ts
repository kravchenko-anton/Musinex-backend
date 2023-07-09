const puppeteer = require("puppeteer");

export const mp3Parser = async (name: string) => {
  // const slugifyName = name.replace(/ /g, "-").toLowerCase();
  // const browser = await puppeteer.launch({
  //   headless: "new"
  // });
  // const page = await browser.newPage();
  // await page.goto(`https://music.я.ws/search/${slugifyName}`);
  // // Error handling for not found
  // const element = await page.$("#xbody > div > .xtitle");
  // if (element) return console.log("Not found in mp3Parser");
  // await page.waitForSelector(".playlist .track:nth-child(1)");
  // const mp3 = await page.evaluate(() => {
  //   const quotes = document.querySelectorAll(".track");
  //   return Array.from(quotes).map((q) => {
  //     const title = q.querySelector(".playlist-name > em").textContent;
  //     const author = q.querySelector(".playlist-name > b").textContent;
  //     const song = q.getAttribute("data-mp3");
  //     return { title, author, song };
  //   });
  // });
  // const searchSong = mp3.find((q) => {
  //   return q.title.toLowerCase() === name.toLowerCase() ? q.song : console.log("Not found in mp3 find");
  // });
  // return `https://music.%D1%8F.ws/${searchSong.song}`;
};

mp3Parser("Metamorphosis 3").then((value) => {
  console.log("done", value);
  process.exit(0);
});

