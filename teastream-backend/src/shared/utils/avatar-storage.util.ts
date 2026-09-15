import { UnsupportedMediaTypeException } from '@nestjs/common'
import type { Request } from 'express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export const UPLOAD_DIR = join(process.cwd(), 'uploads')
export const AVATAR_UPLOAD_DIR = join(UPLOAD_DIR, 'avatars')
export const AVATAR_MAX_SIZE = 5 * 1024 * 1024

export const avatarMulterOptions = {
	storage: diskStorage({
		destination: AVATAR_UPLOAD_DIR,
		filename: (
			req: Request,
			file: Express.Multer.File,
			callback: (error: Error | null, filename: string) => void
		) => {
			callback(
				null,
				`${req.user?.id}-${uuidv4()}${extname(file.originalname)}`
			)
		}
	}),
	fileFilter: (
		req: Request,
		file: Express.Multer.File,
		callback: (error: Error | null, acceptFile: boolean) => void
	) => {
		if (!file.mimetype.startsWith('image/')) {
			return callback(
				new UnsupportedMediaTypeException('avatar must be an image'),
				false
			)
		}

		callback(null, true)
	},
	limits: {
		fileSize: AVATAR_MAX_SIZE
	}
}
