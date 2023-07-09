const puppeteer = require("puppeteer");

export const mp3Parser = async (name: string) => {
  const slugifyName = name.replace(/ /g, "-").toLowerCase();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`https://music.я.ws/search/${slugifyName}`);
  await page.waitForSelector(".playlist .track:nth-child(1)");
  const mp3 = await page.evaluate(() => {
    return document.querySelector(".playlist .track:nth-child(1)").getAttribute("data-mp3");
  });
  return `https://music.%D1%8F.ws/${mp3}`;
};

mp3Parser("Metamorphosis 3").then((value) => {
  
  console.log("done", value);
  process.exit(0);
});


