import { Controller } from '@nestjs/common'
import { SongService } from './song.service'

@Controller('song')
export class SongController {
	constructor(private readonly songService: SongService) {}

	//get all
	//get by id
	//create
	//update
}
