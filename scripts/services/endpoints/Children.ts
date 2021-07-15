import { GoatResource } from '../GoatResource'
import { InLaw } from '../../../types/goat/InLaw'

export class Children extends GoatResource {
	//Sons
	async getSonsStatus(): Promise<any> {
		const data = await this.request({ 'xingqin': { 'xingqinsuc': [] }, 'rsn': '4fcgmahfhxf' })
		return data.a.xingqin
	}

	async raiseAllSons(): Promise<boolean> {
		try {
			await this.request({ 'rsn': '3hfkkwrshp', 'son': { 'allplay': [] } })
		} catch (e) {
			return false
		}
		return true
	}

	async nameSon(id: number): Promise<void> {
		const randName = await this.request({ 'rsn': '7coycpvlov', 'guide': { 'sonRandName': { 'id': id } } })
		const name = randName.a.system.randname.name
		await this.request({ 'rsn': '6wuxwkywkb', 'son': { 'sonname': { 'name': name, 'id': id } } })
	}

	async useEnergyDraught(son: number, num: number): Promise<void> {
		await this.request({ 'rsn': '3hkehwrepf', 'son': { 'OneTapFood': { 'sid': son, 'num': num } } })
	}

	async evaluateSon(son: number): Promise<void> {
		await this.request({ 'rsn': '7yclgxsgvlp', 'son': { 'keju': { 'id': son } } })
	}

	//InLaws
	async getInLaws(): Promise<InLaw[]> {
		const friends = await this.request({ 'friends': { 'getPrivateChatData': [] }, 'rsn': '7yvovxpxyp' })
		return friends.a.friends.qjlist
	}

	async visitInLaw(uid: string): Promise<void> {
		await this.request({ 'friends': { 'qjvisit': { 'fuid': uid } }, 'rsn': '3hzewhwzkp' })
	}
}
