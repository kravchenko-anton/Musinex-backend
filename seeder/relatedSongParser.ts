const puppeteer = require("puppeteer");
export const relatedSongParser = async (name: string) => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(`https://www.chosic.com/playlist-generator/`);
  await page.waitForSelector(".css-47sehv");
  await page.click(".css-47sehv");
  await page.waitForSelector("#search-word");
  await page.type("#search-word", name);
  await page.waitForSelector("#form-suggestions > #hh1");
  await page.click("#form-suggestions > #hh1");
  await page.click("#generate-button");
  await page.waitForSelector(".all-suggests > .song-div:nth-child(1)");
  return await page.evaluate(() => {
    const quotes = document.querySelectorAll(".song-div");
    return Array.from(quotes).map((q) => {
      const title = q.querySelector(".track-list-item-info-text > div > a").textContent;
      const author = q.querySelector(".track-list-item-info-genres > p").textContent;
      return { title, author };
    });
  });
};

relatedSongParser("You Last Worlds").then((value) => {
  console.log("done", value);
  process.exit(0);
});

//   // const quotes = await page.evaluate(() => {
//   //   const songElements = document.querySelectorAll(".song-div");
//   //   return Array.from(songElements).map((quote) => {
//   //     const text = quote.querySelector("div:nth-child(1) > .track-list-item-info-text > .div:nth-child(1) > a").textContent;
//   //     const author = quote.querySelector("div:nth-child(1) > .track-list-item-info-genres > .ng-binding > a").textContent;
//   //     return { text, author };
//   //   });
//   // });