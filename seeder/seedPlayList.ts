import { PrismaClient } from '@prisma/client'

const colors = require('colors')

const prisma = new PrismaClient()

export const createPlaylistFromPopular = async (startIndex: number = 0) => {
	const popular = await fetch(
		`https://api.deezer.com/chart/${startIndex}/playlists?limit=1000`
	).then(res => res.json())

	if (!popular || !popular.data) {
		console.log(colors.bgRed('Not found in popular playlists'))
		return
	}
	for (let i = 0; i < popular.data.length; i++) {
		setTimeout(async () => {
			const deezer = popular.data[i]
			const playlist = await fetch(
				`https://api.deezer.com/playlist/${deezer.id}`
			).then(res => res.json())

			if (!playlist || playlist.error) {
				console.log(
					colors.bgRed(
						`${playlist.error ? 'Error in' : 'Not found in'} 'playlist' | ${
							deezer.title
						} - title | ${deezer.id} playlistID | ${i} songID`
					)
				)
				return
			}

			const songs = playlist.tracks.data

			if (!songs || songs.length === 0) {
				console.log(colors.bgRed(`Not found in songs`))
				return
			}
			// tracks
			for (let j = 0; j < songs.length; j++) {
				const song = songs[j]

				if (
					!song ||
					!song.title ||
					!song.duration ||
					!song.artist ||
					!song.artist.name ||
					!song.album ||
					!song.album.title ||
					!song.album.cover_big ||
					!song.album.cover_medium ||
					!song.album.cover_small
				) {
					console.log(
						colors.bgRed(
							`Not found in song ${j} | ${song.title} | ${song.duration} sek`
						)
					)
					return
				}

				const currentSong = await fetch(
					`https://api.deezer.com/track/${song.id}`
				).then(res => res.json())

				if (
					!currentSong ||
					currentSong.error ||
					!currentSong.album.id ||
					!currentSong.artist.id
				) {
					console.log(colors.bgRed(`Not found in currentSong`))
					return
				}

				const artist = await fetch(
					'https://api.deezer.com/artist/' + currentSong.artist.id
				).then(res => res.json())

				const album = await fetch(
					'https://api.deezer.com/album/' + currentSong.album.id
				).then(res => res.json())

				if (
					!artist ||
					artist.error ||
					!album ||
					album.error ||
					!currentSong ||
					currentSong.error ||
					!album.genres ||
					!album.genres.data[0] ||
					!artist.name ||
					!album.title
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
									: 'track'
							} | ${song.title}
							- title | ${deezer.id} songID | ${j} songIndex`
						)
					)
					return
				}

				const oldSong = await prisma.song.findFirst({
					where: {
						title: currentSong.title
					}
				})

				const oldPlayList = await prisma.playlist.findFirst({
					where: {
						title: deezer.title
					}
				})

				if (oldSong || oldPlayList) {
					console.log(
						colors.bgYellow(
							`${oldSong ? 'song' : 'playlist'} ${j} | ${
								deezer.title
							} already exists`
						)
					)
					return
				}

				await prisma.playlist.create({
					include: {
						songs: true
					},
					data: {
						title: playlist.title,
						releaseDate: new Date(playlist.creation_date),
						fans: playlist.fans,
						coverBig: playlist.picture_big,
						coverMedium: playlist.picture_medium,
						coverSmall: playlist.picture_small,
						User: {
							connectOrCreate: {
								where: {
									email: 'dreezer@gmail.com'
								},
								create: {
									name: 'Deezer',
									email: 'dreezer@gmail.com',
									avatarPath: './assets/deezer.png',
									password: '12345678'
								}
							}
						},
						songs: {
							connectOrCreate: {
								where: {
									title: currentSong.title
								},
								create: {
									duration: currentSong.duration,
									title: currentSong.title,
									releaseDate: new Date(currentSong.release_date),
									coverBig: currentSong.album.cover_big,
									coverMedium: currentSong.album.cover_medium,
									coverSmall: currentSong.album.cover_small,
									mp3Path: currentSong.preview,
									albums: {
										connectOrCreate: {
											where: {
												title: album.title
											},
											create: {
												title: album.title,
												releaseDate: new Date(album.release_date),
												coverBig: album.cover_big,
												coverMedium: album.cover_medium,
												coverSmall: album.cover_small,
												fans: album.fans
											}
										}
									},
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
									artists: {
										connectOrCreate: {
											where: {
												name: artist.name
											},
											create: {
												name: artist.name,
												pictureBig: artist.picture_big,
												pictureMedium: artist.picture_medium,
												pictureSmall: artist.picture_small,
												followers: artist.nb_fan
											}
										}
									}
								}
							}
						}
					}
				})

				console.log(colors.bgGreen(`Created playlist ${i} | ${playlist.title}`))
			}
		}, (i + startIndex) * 500)
	}
}
