'use strict'

const { test } = require('tap')
const app = require('./app')

test('requests the "/instruments/:symbol" route', async t => {
  const response = await app.inject({
    method: 'GET',
    url: '/instruments/ETH'
  })
  t.equal(response.statusCode, 200, 'returns a status code of 200')
})