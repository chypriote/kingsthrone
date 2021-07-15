import { GoatResource } from '../GoatResource'

export class Mail extends GoatResource {
	async readAllMail(): Promise<void> {
		await this.request({ 'rsn': '6swkxspslyk', 'mail': { 'redAllMails': [] } })
	}

	async deleteAllMail(): Promise<void> {
		await this.request({ 'rsn': '7xcpyxsxdsv', 'mail': { 'delMails': [] } })
	}

	async openMail(id: number): Promise<void> {
		await this.request({ 'rsn': '3zehpepsrew', 'mail': { 'openMails': { 'mid': id } } })
	}
}
