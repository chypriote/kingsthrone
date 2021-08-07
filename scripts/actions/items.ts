import { find } from 'lodash'
import { goat, Item } from 'kingsthrone-api'
import { ITEMS, RESOURCES_ITEMS, REWARD_PACKS } from 'kingsthrone-api/lib/types/Item'
import { Progress } from '../services/progress'

interface IState {
	items: Item[]
}
const state: IState = {
	items: [],
}

export const useAllItems = async (types: number[]): Promise<void> => {
	const selected = state.items.filter((it) => types.includes(it.id))

	for (const item of selected) {
		let count = item.count
		while (count) {
			count = (await goat.items.use(item.id, Math.min(count, 100))).count
		}
	}
}
const openRewardPacks = async (): Promise<void> => {
	await useAllItems(REWARD_PACKS)
}
const useResourceItems = async (): Promise<void> => {
	await useAllItems(RESOURCES_ITEMS)
}
const useExperiencePacks = async (): Promise<void> => {
	await useAllItems([ITEMS.EXPERIENCE_PACK, ITEMS.SUP_EXPERIENCE_PACK])
}
const openMaidenBoxes = async (): Promise<void> => {
	await useAllItems([ITEMS.JEWELRY_BOX, ITEMS.FESTIVAL_BOX])
}
const openManuscriptCaches = async (): Promise<void> => {
	await useAllItems([ITEMS.MANUSCRIPT_CACHE])
}

const getItem = (id: number): Item => {
	return find(state.items, (it) => it.id === id) || { id, count: 0, kind: 0 }
}

const combineItems = async (): Promise<void> => {
	const famedFragments = getItem(ITEMS.FAMED_HERO_FRAGMENT)
	if (famedFragments.count >= 8) {
		await goat.items.combine(ITEMS.FAMED_HERO_TOKEN, 1)
	}

	const manuscriptPages = getItem(ITEMS.MANUSCRIPT_PAGE)
	const manuscriptCaches = getItem(ITEMS.MANUSCRIPT_CACHE)
	if (manuscriptPages.count >= 4) {
		await goat.items.combine(ITEMS.MANUSCRIPT_CACHE, Math.trunc(manuscriptPages.count / 4))
		manuscriptCaches.count += Math.trunc(manuscriptPages.count / 4)
	}

	const duelingTokens = getItem(ITEMS.DUELING_FRAGMENT)
	if (duelingTokens.count >= 4) {
		await goat.items.combine(ITEMS.DUELING_INVITATION, Math.trunc(duelingTokens.count / 4))
	}

	const allianceFragment = getItem(ITEMS.ALLIANCE_FRAGMENT)
	const allianceCharter = getItem(ITEMS.ALLIANCE_CHARTER)
	if (allianceFragment.count >= 4) {
		await goat.items.combine(ITEMS.ALLIANCE_CHARTER, Math.trunc(allianceFragment.count / 4))
		allianceCharter.count += Math.trunc(allianceFragment.count / 4)
	}
	if (allianceCharter.count >= 3) {
		await goat.items.combine(ITEMS.ADV_ALLIANCE_CHARTER, Math.trunc(allianceCharter.count / 3))
	}
	await useAllItems([ITEMS.ALLIANCE_SEAL])

	const drawingFragment = getItem(20017)
	if (drawingFragment.count >= 10) {
		await goat.items.combine(14106, Math.trunc(drawingFragment.count / 10))
	}
}

const combineInvestitureItems = async (items: number[], amount: number): Promise<void> => {
	for (const id of items) {
		const item = getItem(id)
		const next = getItem(id + 3)
		if (item.count < amount) {
			continue
		}
		await goat.items.combine(next.id, Math.trunc(item.count / amount))
		next.count += Math.trunc(item.count / amount)
	}
}
const combineInvestiture = async (): Promise<void> => {
	await combineInvestitureItems([ITEMS.RUBY_RING, ITEMS.RUBY_SCEPTER, ITEMS.RUBY_SWORD], 3)
	if (goat._isDemophlos()) { return }
	await combineInvestitureItems([ITEMS.HESSONITE_RING, ITEMS.HESSONITE_SCEPTER, ITEMS.HESSONITE_SWORD], 3)
	await combineInvestitureItems([ITEMS.CITRINE_RING, ITEMS.CITRINE_SCEPTER, ITEMS.CITRINE_SWORD], 4)
	await combineInvestitureItems([ITEMS.EMERALD_RING, ITEMS.EMERALD_SCEPTER, ITEMS.EMERALD_SWORD], 5)
}

export const handleBag = async (): Promise<void> => {
	state.items = await goat.items.getBag()
	const progress = new Progress('Clearing bag', !goat._isShallan() ? 7 : 6, 'tasks')

	await openRewardPacks()
	progress.increment()

	await useResourceItems()
	progress.increment()

	await useExperiencePacks()
	progress.increment()

	await openMaidenBoxes()
	progress.increment()

	await combineItems()
	progress.increment()

	await openManuscriptCaches()
	progress.increment()

	if (!goat._isShallan()) {
		await combineInvestiture()
		progress.increment()
	}

	progress.stop()
}
