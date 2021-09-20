'use strict'
const { Client, Intents } = require('discord.js')
const EventHandler = require('./EventHandler')

class BombaBot {
  client
  eventHandler

  constructor() {
    console.log('I have been created!!!!')
  }

  login() {
    this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
    this.client.login(process.env.TOKEN)
  }

  startBot() {
    this.login()
    this.initEventHandler()
  }

  initEventHandler() {
      this.eventHandler = new EventHandler(this.client)
  }
}

// const BombaBot = {
//   client: undefined,

//   login: () => {
//     console.log(process.env.TOKEN)
//     this.client.login(process.env.TOKEN)
//   },

//   init: () => {
//     this.client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
//    
//       console.log(this)
//       login(process.env.TOKEN)
//     
//   },
// }

module.exports = BombaBot
