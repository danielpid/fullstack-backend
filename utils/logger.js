const config = require('../utils/config')

const info = (...params) => {
  // eslint-disable-next-line no-undef
  if (config.env !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}