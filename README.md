[![SVG Banners](https://svg-banners.vercel.app/api?type=luminance&text1=Musinex-Backend%20📻&width=800&height=400)](https://github.com/Akshay090/svg-banners)

You need this project to run [Musinex](https://github.com/Anton-Kravkenko/Musinex) .

## Features
- auth
- recommendations
- search 
- `real mp3 parser`
- charts


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
## Add real data
```bash
# seeding real song from chart (real mp3 parse)
$ yarn seed 

# seeding playlist from chart
$ yarn seedPlaylists 

# seeding albums from already added songs
$ yarn seedAlbums

# seeding related songs for recommendations
$ yarn related 
```


