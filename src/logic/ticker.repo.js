const { Ticker } = require('../models')

const saveTickers = async rawData => {
	const parsed = JSON.parse(rawData)

	if (!parsed.data) {
		return
	}

	const { data: instData } = parsed

	for (let row of instData) {
		const symbol = row.instId.split('-')[0]
		const obj = { symbol, createdOn: new Date(), ...row }

		let ticker = new Ticker(obj)

		let result = await ticker.save()
		if (result !== ticker) {
			console.error(result)
		}
	}
}

module.exports = {
	saveTickers,
}
