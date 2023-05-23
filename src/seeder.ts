import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

var colors = require('colors')
dotenv.config()
const prisma = new PrismaClient()

const createSongs = async (startIndex: number, quantity: number) => {
	for (let i = startIndex; i < quantity; i++) {
		setTimeout(async () => {
			try {
				const deezer = await fetch(
					`https://api.deezer.com/editorial/${i}/charts?limit=1000`
				).then(res => res.json())

				if (deezer.error) {
					if (deezer.error.code === 800) {
						return null
					} else {
						await new Promise(resolve =>
							setTimeout(resolve, 10000 * 10000)
						).then(() => console.log(colors.bgYellow(`Pause for 1000 seconds`)))
						console.warn(deezer.error.message)
					}
				}

				const search = await fetch(
					`https://soundcloud-downloader4.p.rapidapi.com/soundcloud/search?query=${
						deezer.title_short ? deezer.title_short : deezer.title
					}`,
					{
						headers: {
							'X-RapidAPI-Key':
								'6a4d44d97bmsh9657e022a8567abp16623djsndc7ae30038a7',
							'X-RapidAPI-Host': 'soundcloud-downloader4.p.rapidapi.com'
						}
					}
				).then(res => res.json())
				if (!search.result) {
					console.warn(
						colors.bgRed(
							search.message
								? search.message
								: `Not found in SoundCloud search ${i} | ${
										deezer.title_short ? deezer.title_short : deezer.title
								  } | ${deezer.duration} sek`
						)
					)
					return
				}

				const currentSong = search.result.find(
					(song: any) =>
						(song.title
							.toLowerCase()
							.replace(/ *\([^)]*\) */g, '')
							.replace(/ *\[[^\]]*]/, '')
							.includes(
								deezer.title_short ? deezer.title_short : deezer.title
							) ||
							(deezer.title_short ? deezer.title_short : deezer.title)
								.toLowerCase()
								.replace(/ *\([^)]*\) */g, '')
								.replace(/ *\[[^\]]*]/, '')
								.includes(
									song.title
										.toLowerCase()
										.replace(/ *\([^)]*\) */g, '')
										.replace(/ *\[[^\]]*]/, '')
								)) &&
						song.duration > 30000 &&
						song.duration < deezer.duration * 1000 + 30000
				)

				if (!currentSong) {
					return console.log(
						colors.bgRed(
							`Not found in current song ${i} | ${
								deezer.title_short
									? deezer.title_short
									: deezer.title
											.toLowerCase()
											.replace(/ *\([^)]*\) */g, '')
											.replace(/ *\[[^\]]*]/, '')
							} | ${deezer.duration} sek`
						)
					)
				}

				const song = await fetch(
					`https://soundcloud-downloader4.p.rapidapi.com/soundcloud/track?url=${currentSong.url}`,
					{
						headers: {
							'X-RapidAPI-Key':
								'6a4d44d97bmsh9657e022a8567abp16623djsndc7ae30038a7',
							'X-RapidAPI-Host': 'soundcloud-downloader4.p.rapidapi.com'
						}
					}
				).then(res => res.json())

				if (
					!song ||
					!song.music ||
					!song.music.download_url ||
					!deezer.album.cover_medium ||
					!deezer.album.cover_small ||
					!deezer.album.cover_big ||
					!deezer.release_date
				) {
					return console.log(
						colors.bgRed(
							`Not found in download song ${i} | ${deezer.title} | ${
								!song
									? 'song'
									: !song.music
									? 'music'
									: !song.music.download_url
									? 'download_url'
									: !deezer.album.cover_medium
									? 'cover_medium'
									: !deezer.album.cover_small
									? 'cover_small'
									: !deezer.album.cover_big
									? 'cover_big'
									: !deezer.release_date
									? 'release_date'
									: 'unknown'
							}`
						)
					)
				}

				const file = fs.createWriteStream(`./uploads/songs/${i}.mp3`)
				const downloadResponse = await fetch(song.music.download_url, {})
				const buffer = await downloadResponse.arrayBuffer()
				file.write(Buffer.from(buffer))
				file.end()

				const artist = await fetch(
					'https://api.deezer.com/artist/' + deezer.artist.id
				).then(res => res.json())

				const albumSearchResult = await fetch(
					'https://api.deezer.com/search/album?q=' + deezer.album.title
				).then(res => res.json())

				const Album = albumSearchResult.data.find(
					(album: any) =>
						deezer.album.title
							.toLowerCase()
							.replace(/ *\([^)]*\) */g, '')
							.replace(/ *\[[^\]]*]/, '')
							.includes(
								album.title
									.toLowerCase()
									.replace(/ *\([^)]*\) */g, '')
									.replace(/ *\[[^\]]*]/, '')
							) ||
						album.title
							.toLowerCase()
							.replace(/ *\([^)]*\) */g, '')
							.replace(/ *\[[^\]]*]/, '')
							.includes(
								deezer.album.title
									.toLowerCase()
									.replace(/ *\([^)]*\) */g, '')
									.replace(/ *\[[^\]]*]/, '')
							)
				)

				if (!Album) {
					console.log(
						colors.bgRed(`Not found in album search ${i} | ${deezer.title} |
						${deezer.album.title} - album
						`)
					)
					return
				}

				const album = await fetch(
					'https://api.deezer.com/album/' + Album.id
				).then(res => res.json())

				if (!album || album.error) {
					console.log(colors.bgRed(`Album has an error ${i} | ${deezer.title}`))
					return
				}

				if (!artist || artist.error) {
					console.log(
						colors.bgRed(
							`${artist.error ? 'Error in' : 'Not found in'} 'artist' | ${
								deezer.title
							} - title | ${deezer.artist.id} artistID | ${i} songID | ${
								deezer.album.title
							} - album`
						)
					)
					return
				}

				await prisma.song.create({
					include: {
						genres: true,
						albums: true
					},
					data: {
						duration: deezer.duration,
						title: deezer.title,
						albums: {
							connectOrCreate: {
								where: {
									title: album.title
								},
								create: {
									title: album.title,
									coverBig: album.cover_big,
									coverMedium: album.cover_medium,
									coverSmall: album.cover_small,
									releaseDate: new Date(deezer.album.release_date),
									fans: album.fans,
									artist: {
										connectOrCreate: {
											where: {
												name: artist.name
											},
											create: {
												name: artist.name,
												pictureBig: artist.picture_big,
												pictureSmall: artist.picture_small,
												pictureMedium: artist.picture_medium,
												followers: artist.nb_fan
											}
										}
									}
								}
							}
						},
						releaseDate: new Date(deezer.release_date),
						artists: {
							connectOrCreate: {
								where: {
									name: artist.name
								},
								create: {
									name: artist.name,
									pictureBig: artist.picture_big,
									pictureSmall: artist.picture_small,
									pictureMedium: artist.picture_medium,
									followers: artist.nb_fan
								}
							}
						},
						genres: {
							connectOrCreate: {
								where: {
									name: song.music.genres ? song.music.genres : 'Other'
								},
								create: {
									name: song.music.genres ? song.music.genres : 'Other'
								}
							}
						},
						coverBig: deezer.album.cover_big,
						coverMedium: deezer.album.cover_medium,
						coverSmall: deezer.album.cover_small,
						mp3Path: `./uploads/songs/${deezer.title}.mp3`
					}
				})

				console.log(colors.bgGreen(`Created song ${i} | ${deezer.title}`))
			} catch (e) {
				console.log(colors.red(e))
			}
		}, (i - startIndex) * 2000)
	}
}

async function main() {
	console.log(colors.bgCyan('Start seeding...'))
	await createSongs(3135556, 3235556)
}

main()
	.catch(e => {
		console.error(e)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
