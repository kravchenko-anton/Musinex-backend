import {
	Controller,
	HttpCode,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from '../auth/decorator/auth.decorator'
import { CurrentUser } from '../auth/decorator/user.decorator'
import { varieties } from '../types/varieties'
import { UserUpdateDto } from './dto/user.update.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@HttpCode(200)
	@Auth()
	@Post('/get-profile')
	async getProfile(@CurrentUser('id') id: number) {
		return this.usersService.getById(id)
	}

	@HttpCode(200)
	@Auth()
	@Patch('/toggle-favorite/:type/:id')
	async toggleFavorite(
		@CurrentUser('id') userId: number,
		@Param('type') type: varieties,
		id: number
	) {
		return this.usersService.toggleFavorite(userId, id, type)
	}

	@HttpCode(200)
	@Auth()
	@UsePipes(new ValidationPipe())
	@Post('/update-user')
	async updateUser(@CurrentUser('id') id, dto: UserUpdateDto) {
		return this.usersService.updateUser(id, dto)
	}
}
