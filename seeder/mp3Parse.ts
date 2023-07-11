import { Browser, Page } from "puppeteer";

const colors = require("colors");
export const mp3Parse = async (name: string, browser: Browser, page: Page): Promise<string | null> => {
  const slugifyName = name.replace(/ /g, "-").replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
  await page.goto(`https://music.я.ws/search/${slugifyName}`);
  const element = await page.$("#xbody > div > .xtitle");
  if (element) {
    await browser.newPage();
    console.log(colors.bgRed.white.bold("Not found in mp3Parser " + name));
    return null;
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
    if (!(q.title.toLowerCase() === name.toLowerCase())) return null;
    return q.song;
  });
  if (!searchSong) {
    await browser.newPage();
    console.log(colors.bgYellow.white.bold("Not found in searchSong " + name));
    return null;
  }
  return `https://music.%D1%8F.ws/${searchSong.song}`;
};