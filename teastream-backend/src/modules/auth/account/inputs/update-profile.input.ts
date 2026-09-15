import { Field, InputType } from '@nestjs/graphql'
import {
	IsEmail,
	IsOptional,
	IsString,
	Matches,
	MaxLength
} from 'class-validator'

@InputType()
export class UpdateProfileInput {
	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	@Matches(/^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/)
	public username?: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	@IsEmail()
	public email?: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(50)
	public displayName?: string

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	@MaxLength(300)
	public bio?: string
}
