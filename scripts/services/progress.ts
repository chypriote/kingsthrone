import chalk = require('chalk')
const cliProgress = require('cli-progress')

export class Progress {
	progress: typeof cliProgress.SingleBar

	constructor(name: string, max: number, suffix?: string|null, start = 0) {

		this.progress = new cliProgress.SingleBar({
			format: `${name}\t| ${chalk.green('{bar}')} | {value}/{total} ${suffix ? suffix : ''}`,
			barCompleteChar: '\u2588',
			barIncompleteChar: '\u2591',
			hideCursor: false,
		})
		this.progress.start(max, start)
	}

	increment(): void {
		this.progress.increment()
	}

	stop(): void {
		this.progress.stop()
	}

	update(value: number): void {
		this.progress.update(value)
	}
}
