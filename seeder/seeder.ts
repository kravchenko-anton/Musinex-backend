import { PrismaClient } from '@prisma/client'

import * as dotenv from 'dotenv'
import { playlistSearchEqual } from './checkPlayListSongCount'
import { seedAlreadyAddedAlbum } from './seedAlreadyAddedAlbum'
import { createPlaylistFromPopular } from './seedPlayList'
import { createSongsFromPopular } from './seedSong'

dotenv.config()
const prisma = new PrismaClient()
const colors = require('colors')

async function main() {
	console.log(colors.bgCyan('Start seeding...'))
	await playlistSearchEqual()
	await createPlaylistFromPopular()
	await createSongsFromPopular()
	await seedAlreadyAddedAlbum()
}

main()
	.catch(e => {
		console.error(e)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
