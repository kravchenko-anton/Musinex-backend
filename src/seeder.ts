import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()
const createSongs = async (startIndex: number, quantity: number) => {
	const songs = []
	for (let i = startIndex; i < quantity; i++) {
		setTimeout(() => {
			fetch(`https://api.deezer.com/track/${i}`).then(async res => {
				res.json().then(async dezzer => {
					if (dezzer.error) {
						return console.warn(
							dezzer.error.code === 800
								? 'Not found drezzer'
								: dezzer.error.message
						)
					}
					fetch(
						`https://soundcloud-downloader4.p.rapidapi.com/soundcloud/search?query=${dezzer.title}`,
						{
							headers: {
								'X-RapidAPI-Key':
									'6a4d44d97bmsh9657e022a8567abp16623djsndc7ae30038a7',
								'X-RapidAPI-Host': 'soundcloud-downloader4.p.rapidapi.com'
							}
						}
					)
						.then(async res => {
							res.json().then(async search => {
								if (!search.result)
									return console.warn('Not found in soundcloud search' + i)
								const CurrentSong = search.result.find(
									songs =>
										songs.title.includes(dezzer.title) &&
										songs.duration > 30000 &&
										songs.duration < dezzer.duration * 1000 + 1000
								)
								if (!CurrentSong)
									return console.warn('Not found in found current song ' + i)
								fetch(
									`https://soundcloud-downloader4.p.rapidapi.com/soundcloud/track?url=${CurrentSong.url}`,
									{
										headers: {
											'X-RapidAPI-Key':
												'6a4d44d97bmsh9657e022a8567abp16623djsndc7ae30038a7',
											'X-RapidAPI-Host': 'soundcloud-downloader4.p.rapidapi.com'
										}
									}
								).then(async res => {
									res
										.json()
										.then(async song => {
											if (
												!song ||
												!song.music ||
												!song.music.download_url ||
												!dezzer.album.cover_medium ||
												!dezzer.album.cover_small ||
												!dezzer.album.cover_big ||
												!dezzer.release_date ||
												!song.music.genres
											)
												return console.warn('Not found in download song' + i)
											const newSong = await prisma.song.create({
												include: {
													Genre: true
												},
												data: {
													duration: dezzer.duration,
													title: dezzer.title,
													releaseDate: new Date(dezzer.release_date),
													Genre: {
														connectOrCreate: {
															where: {
																name: song.music.genres
															},
															create: {
																name: song.music.genres
															}
														}
													},
													coverBig: dezzer.album.cover_big,
													coverMedium: dezzer.album.cover_medium,
													coverSmall: dezzer.album.cover_small,
													mp3Path: song.music.download_url
												}
											})
											songs.push(newSong)
											console.warn(
												`Created song ${i}, ${song.music.download_url}`
											)
										})
										.catch(e => {
											console.log(e)
										})
								})
							})
						})
						.catch(e => {
							console.log(e)
						})
				})
			})
		}, (i - startIndex) * 150)
	}
}

async function main() {
	console.log('Start seeding...')
	await createSongs(50100, 50400)
}

main()
	.catch(e => {
		console.error(e)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
