'use strict'

const { test } = require('tap')
const app = require('./app')

test('requests the "/instruments/:symbol" route', async t => {
	const response = await app.inject({
		method: 'GET',
		url: '/instruments/ETH',
	})
	t.equal(response.statusCode, 200, 'returns a status code of 200')
})

test('requests the "/instruments/:symbol" route with invalid symbol', async t => {
	const response = await app.inject({
		method: 'GET',
		url: '/instruments/INVALID',
	})
	t.equal(response.statusCode, 500, 'returns a status code of 500')
})

test('requests the "/instruments/deleteall" route', async t => {
	const response = await app.inject({
		method: 'DELETE',
		url: '/instruments/deleteall',
	})
	t.equal(response.statusCode, 200, 'returns a status code of 200')
})

test('requests the "/instruments/deleteall" route with no records', async t => {
	const response = await app.inject({
		method: 'DELETE',
		url: '/instruments/deleteall',
	})
	t.equal(response.statusCode, 400, 'returns a status code of 400')
})

// Additional tests for edge cases and error handling

test('requests the "/instruments/:symbol" route with missing symbol', async t => {
	const response = await app.inject({
		method: 'GET',
		url: '/instruments/',
	})
	t.equal(response.statusCode, 404, 'returns a status code of 404')
})

test('requests the "/instruments/:symbol" route with special characters in symbol', async t => {
	const response = await app.inject({
		method: 'GET',
		url: '/instruments/!@#$%',
	})
	t.equal(response.statusCode, 500, 'returns a status code of 500')
})

test('requests the "/instruments/:symbol" route with valid symbol but no data', async t => {
	const response = await app.inject({
		method: 'GET',
		url: '/instruments/XYZ',
	})
	t.equal(response.statusCode, 200, 'returns a status code of 200')
	t.same(response.json(), { data: [] }, 'returns an empty data array')
})

test('requests the "/instruments/deleteall" route with invalid method', async t => {
	const response = await app.inject({
		method: 'POST',
		url: '/instruments/deleteall',
	})
	t.equal(response.statusCode, 404, 'returns a status code of 404')
})
