import * as fs from "fs";
import { Browser, Page } from "puppeteer";

const colors = require("colors");


export const mp3Parse = async (name: string, duration: number, browser: Browser, page: Page): Promise<string | null> => {
  await page.goto(`https://music.я.ws/search/${name}`);
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
      const seconds = q.querySelector("em > .playlist-duration").textContent.split(":").reverse();
      
      const song = q.getAttribute("data-mp3");
      return {
        title, song,
        duration: seconds.reduce((acc, cur, i) => acc + parseInt(cur) * Math.pow(60, i), 0)
      };
    });
  });
  const searchSong = mp3.find((q) => {
    if ((q.title.toLowerCase() !== name.toLowerCase()) || q.duration.toString().slice(0, 2) !== duration.toString().slice(0, 2)) return null;
    return q.song;
  });
  if (!searchSong) {
    await browser.newPage();
    console.log(colors.bgMagenta.white.bold("Not found in searchSong " + name + " | " + duration));
    return null;
  }
  const song = await fetch(`https://music.я.ws/${searchSong.song}`).then((res) => res.blob());
  const buffer = await song.arrayBuffer();
  const buffer2 = Buffer.from(buffer);
  fs.mkdirSync("./dist/public/mp3", { recursive: true });
  fs.writeFileSync(`./dist/public/mp3/${name}.mp3`, buffer2);
  return `/mp3/${name}.mp3`;
};



