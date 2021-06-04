export type PunishmentResult = {
	laofang: {
		da: number //current prisoner
		hit: number //times hit
		kaifang: number //total existing prisoners
	}
	mingwang: {
		eday: number //punishment per day
		maxmw: number //max punishments doable (depends on number on prisoners)
		mw: number //punishments left
	}
}
