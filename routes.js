const axios = require('axios')

const api = 'http://countdown.api.tfl.gov.uk/interfaces/ura/instant_V1'

module.exports = (app) => {
  app.post('/:stopPoint', (req, res) => {
    const { options } = req.body
    const { stopPoint } = req.params

    axios.get(api, {
      params: {
        StopCode1: stopPoint,
        ...options
      }
    })
      .then((response) => {
        res.json(JSON.parse(`[${response.data.replace(/]/g, '],').replace(/\],$/, ']').toString()}]`))
      })
      .catch((err) => {
        res.sendStatus(err.response.status)
      })
  })
}
