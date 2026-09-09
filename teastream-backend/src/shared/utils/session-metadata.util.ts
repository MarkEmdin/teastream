import DeviceDetector from 'device-detector-js'
import type { Request } from 'express'
import { lookup } from 'geoip-lite'
import * as countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'

import { SessionMetadata } from '../types/sesion-metadata.types'

import { IS_DEV_ENV } from './is-dev.util'

countries.registerLocale(enLocale)

export function getSessionMetadata(
	req: Request,
	userAgent: string
): SessionMetadata {
	const ip: string = IS_DEV_ENV
		? '173.166.164.121'
		: (Array.isArray(req.headers['cf-connecting-ip'])
				? req.headers['cf-connecting-ip'][0]
				: req.headers['cf-connecting-ip']) ||
			(typeof req.headers['x-forwarded-for'] === 'string'
				? req.headers['x-forwarded-for'].split(',')[0]
				: req.ip) ||
			'0.0.0.0'

	const location = lookup(ip)
	const device = new DeviceDetector().parse(userAgent)

	return {
		location: {
			country:
				countries.getName(location?.country ?? '', 'en') || 'unknown',
			city: location?.city || 'unknown',
			latitude: location?.ll[0] || 0,
			longitude: location?.ll[1] || 0
		},
		device: {
			browser: device.client?.name || 'unknown',
			os: device.os?.name || 'unknown',
			type: device.device?.type || 'unknown'
		},
		ip
	}
}
