var Alexa = require('alexa-sdk')
const axios = require('axios')
const ResponseHandler = require('./src/ResponseHandler')

const APP_ID = 'amzn1.ask.skill.f76ab18b-f5f4-4d2a-b9ca-a07ccf3d0013'
const SKILL_NAME = "My Foodbank"
const HELP_MESSAGE = "You can say what does my foodbank need in your town, or, you can say exit... What can I help you with?"
const HELP_REPROMPT = "What town is the foodbank you are looking for in?"
const STOP_MESSAGE = "Goodbye!"

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context, callback)
    alexa.registerHandlers(handlers)
    alexa.id = APP_ID
    alexa.execute()
}

var handlers = {
    'LaunchRequest': function () {
        this.emit('ProductsIntent')
    },

    ProductsIntent () {
        const town = this.event.request.intent.slots.location.value
        axios.get('http://foodbank-server.dev/api/banks?name=' + town)
             .then(res => {
               let response = ResponseHandler.ProductsIntent(town, res.data.data)
                this.emit(response.emitter, response.text)
            })
            .catch(err => {
                this.emit(':tell', `Sorry, we don't have information for ${town}`)
            })
    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', HELP_MESSAGE, HELP_REPROMPT)
    },

    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE)
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE)
    }
}
