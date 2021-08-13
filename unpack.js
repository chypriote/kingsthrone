const fs = require('fs').promises
const path = require('path')

const decryptFile = async (file, currentPath) => {
	const buffer = await fs.readFile(path.join(currentPath, file))
	const content = Buffer.from(buffer, 'ascii')
	const value = content.toString('hex')
	const final = value.replace(/^545b735f6270563445535d28/, '')
	await fs.writeFile(path.join(currentPath, file), final, 'hex')
}

async function unpack(dir) {
	const items = await fs.readdir(dir)

	console.log(`Found ${items.length} items in dir ${dir}`)

	const promises = []
	for (const item of items) {
		const itemPath = path.join(dir, item)
		if ((await fs.stat(itemPath)).isDirectory()) {
			await unpack(itemPath)
		} else {
			promises.push(decryptFile(item, dir))
		}
	}
	await Promise.all(promises)
}

unpack('D:\\Nicolas\\Downloads\\KTupdates\\kingZsjEfun_01_0450\\stu\\assetsRes\\res')
	.then(() => {
		console.log('Finished')
		process.exit()
	})

