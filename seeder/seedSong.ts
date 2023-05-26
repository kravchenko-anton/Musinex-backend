import { PrismaClient } from '@prisma/client'

const colors = require('colors')

const prisma = new PrismaClient()

export const createSongsFromPopular = async (startIndex: number = 0) => {
	try {
		const search = await fetch(
			'https://api.deezer.com/chart/' + startIndex + '/tracks?limit=1000'
		).then(res => res.json())
		for (let j = 0; j < search.data.length; j++) {
			setTimeout(async () => {
				const deezer = search.data[j]
				const track = await fetch(
					'https://api.deezer.com/track/' + deezer.id
				).then(res => res.json())

				const artist = await fetch(
					'https://api.deezer.com/artist/' + deezer.artist.id
				).then(res => res.json())

				const album = await fetch(
					'https://api.deezer.com/album/' + deezer.album.id
				).then(res => res.json())

				if (
					!artist ||
					artist.error ||
					!album ||
					album.error ||
					!track ||
					track.error ||
					!album.genres ||
					!album.genres.data[0] ||
					!artist.name ||
					!album.title ||
					!deezer.title
				) {
					console.log(
						colors.bgRed(
							`${artist.error ? 'Error in' : 'Not found in'} ${
								!artist
									? 'artist'
									: !album
									? 'album'
									: !album.genres
									? 'album genres'
									: !artist.name
									? 'artist name'
									: !album.title
									? 'album title'
									: !deezer.title
									? 'deezer title'
									: 'track'
							} | ${deezer.title}
							- title | ${deezer.id} songID | ${j} songIndex`
						)
					)
					return
				}

				const oldSong = await prisma.song.findFirst({
					where: {
						title: deezer.title
					}
				})

				if (oldSong) {
					console.log(
						colors.bgYellow(`Song ${j} | ${deezer.title} already exists`)
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
						genres: {
							connectOrCreate: {
								where: {
									name: album.genres.data[0].name
								},
								create: {
									name: album.genres.data[0].name
								}
							}
						},
						releaseDate: new Date(track.release_date),
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
									releaseDate: new Date(album.release_date),
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
						coverBig: deezer.album.cover_big,
						coverMedium: deezer.album.cover_medium,
						coverSmall: deezer.album.cover_small,
						mp3Path: deezer.preview
					}
				})

				console.log(colors.bgGreen(`Created song ${j} | ${deezer.title}`))
			}, (j + startIndex) * 250)
		}
	} catch (error) {
		console.error(colors.bgRed('Error:' + error))
	}
}
