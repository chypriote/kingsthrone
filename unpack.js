const fs = require('fs').promises
const path = require('path')
const chalk = require('chalk')

const decryptFile = async (file, currentPath) => {
	try {
		const buffer = await fs.readFile(path.join(currentPath, file))
		const content = Buffer.from(buffer, 'ascii')
		const value = content.toString('hex')
		const final = value.replace(/^545b735f6270563445535d28/, '')
		await fs.writeFile(path.join(currentPath, file), final, 'hex')
	} catch (e) {
		console.log(chalk.red(`${currentPath}/${file} not converted because: ${e.toString()}`))
		console.trace()
	}
}

async function unpack(dir) {
	const items = await fs.readdir(dir)

	console.log(`Found ${items.length} items in dir ${dir}`)

	const promises = []
	for (const item of items) {
		const itemPath = path.join(dir, item)
		if (['.git', '.idea'].includes(item)) {continue}
		if ((await fs.stat(itemPath)).isDirectory()) {
			await unpack(itemPath)
		} else {
			promises.push(decryptFile(item, dir))
		}
	}
	await Promise.all(promises)
}

unpack('E:\\Workspace\\datathrone')
	.then(() => {
		console.log('Finished')
		process.exit()
	})

