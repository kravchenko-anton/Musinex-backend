[![SVG Banners](https://svg-banners.vercel.app/api?type=typeWriter&text1=Musinex-Backend📻&width=800&height=150)](https://github.com/Akshay090/svg-banners)
You need this project to run [Musinex](https://github.com/Anton-Kravkenko/Musinex).

## Features
- auth 👤
- recommendations 🧾
- search 🔎
- `real mp3 parser` 🎧
- charts 🎉



## Installation

```bash
$ yarn install
```

## Running the app
```bash
# pisma
$ yarn pisma generate
$ yarn pisma db push

# start
$ yarn start
```
## Parse data
```bash
# install puppeteer
$ yarn add puppeteer

# seeding real song from chart (real mp3 parse)
$ yarn seed 

# seeding playlist from chart
$ yarn seedPlaylists 

# seeding albums from already added songs
$ yarn seedAlbums

# seeding related songs for recommendations
$ yarn related 
```


#### notes
- you need add to dist file more icon for genre (use [this](https://www.flaticon.com/))
- you need add .env file where you need add `DATABASE_URL` and `JWT_SECRET`
- install insomnia and import `insomnia.json` file