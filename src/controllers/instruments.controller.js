const { Ticker } = require('../models')

exports.getinstruments = async (req, res) => {
	try {
		const { symbol } = req.params
		const data = await Ticker.find({ symbol: symbol })
			.sort({ createdOn: -1 })
			.limit(10)

		return res.status(200).send({
			data,
		})
	} catch (error) {
		return res.status(500).send({
			error: error,
		})
	}
}

exports.deleteall = async (req, res) => {
	try {
		const foundOnes = await Ticker.find()
		if (!foundOnes) {
			return res.status(400).send({ message: 'Did not find anything!' })
		}

		const deleted = await Ticker.deleteMany()
		if (!deleted) {
			return res.status(500).send({ message: 'Unexpected error!' })
		}

		res.status(200).send({
			message: `Deleted successfully! Total count => ${deleted.deletedCount}`,
		})
	} catch (error) {
		return res.status(500).send({
			error: error,
		})
	}
}
