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
				const deezerResponse = await fetch(`https://api.deezer.com/track/${i}`)
				const deezer = await deezerResponse.json()

				if (deezer.error) {
					if (deezer.error.code === 800) {
						return null // Skip to the next iteration if there's an error code 800
					} else {
						console.warn(deezer.error.message) // Log the error message
					}
				}

				const soundcloudResponse = await fetch(
					`https://soundcloud-downloader4.p.rapidapi.com/soundcloud/search?query=${deezer.title}`,
					{
						headers: {
							'X-RapidAPI-Key':
								'6a4d44d97bmsh9657e022a8567abp16623djsndc7ae30038a7',
							'X-RapidAPI-Host': 'soundcloud-downloader4.p.rapidapi.com'
						}
					}
				)
				const search = await soundcloudResponse.json()
				if (!search.result) {
					console.warn(
						colors.bgRed(
							search.message
								? search.message
								: `Not found in SoundCloud search ${i} | ${deezer.title}`
						)
					)
					return
				}

				const currentSong = search.result.find(
					(song: any) =>
						(song.title.includes(
							deezer.title_short ? deezer.title_short : deezer.title
						) ||
							(deezer.title_short ? deezer.title_short : deezer.title).includes(
								song.title
							)) &&
						song.duration > 30000 &&
						song.duration < deezer.duration * 1000 + 5000
				)

				if (!currentSong) {
					return console.log(
						colors.bgRed(
							`Not found in current song ${i} | ${deezer.title} | ${deezer.duration} sek`
						)
					)
				}

				const soundcloudTrackResponse = await fetch(
					`https://soundcloud-downloader4.p.rapidapi.com/soundcloud/track?url=${currentSong.url}`,
					{
						headers: {
							'X-RapidAPI-Key':
								'6a4d44d97bmsh9657e022a8567abp16623djsndc7ae30038a7',
							'X-RapidAPI-Host': 'soundcloud-downloader4.p.rapidapi.com'
						}
					}
				)
				const song = await soundcloudTrackResponse.json()

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

				fs.mkdirSync(`./uploads/songs/${deezer.title}.mp3`)

				const file = fs.createWriteStream(`./uploads/songs/${deezer.title}.mp3`)
				const downloadResponse = await fetch(song.music.download_url)
				const buffer = await downloadResponse.arrayBuffer()
				file.write(Buffer.from(buffer))
				file.end()

				const artistResponse = await fetch(
					'https://api.deezer.com/artist/' + deezer.artist.id
				)
				const artist = await artistResponse.json()

				const albumResponse = await fetch(
					'https://api.deezer.com/search/album?q=' + deezer.album.title
				)
				const albumSearchResult = await albumResponse.json()
				const Album = albumSearchResult.data.find(
					(album: any) =>
						deezer.album.title
							.toUpperCase()
							.includes(album.title.toUpperCase()) ||
						album.title.toUpperCase().includes(deezer.album.title.toUpperCase())
				)

				if (!Album) {
					console.log(
						colors.bgRed(`Not found in album search ${i} | ${deezer.title} |
						${deezer.album.title} - album
						`)
					)
					return
				}

				const albumResponse2 = await fetch(
					'https://api.deezer.com/album/' + Album.id
				)
				const album = await albumResponse2.json()

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
				console.log(colors.bgRed(e))
			}
		}, (i - startIndex) * 600)
	}
}

async function main() {
	console.log(colors.bgCyan('Start seeding...'))
	await createSongs(830000, 9000000)
}

main()
	.catch(e => {
		console.error(e)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
