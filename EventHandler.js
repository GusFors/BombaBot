'use strict'

class EventHandler {
  client

  constructor(client) {
    console.log('EventHandler created')
    this.client = client
  }
}

module.exports = EventHandler
