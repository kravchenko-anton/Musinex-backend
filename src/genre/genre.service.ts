import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class GenreService {
	constructor(private readonly prisma: PrismaService) {}

	getAll() {
		return this.prisma.genre.findMany()
	}

	getById(id: number) {
		return this.prisma.genre.findUnique({
			where: { id: id },
			include: {
				albums: true,
				songs: true,
				playlists: true
			}
		})
	}
}
