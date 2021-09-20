'use strict'

const { Client, Intents } = require('discord.js')
const {
  generateDependencyReport,
  AudioPlayerStatus,
  AudioResource,
  entersState,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} = require('@discordjs/voice')

const EventHandler = require('./EventHandler')

class BombaBot {
  client
  eventHandler
  voiceChannelConnection

  constructor() {
    console.log('I have been created!!!!')
  }

  login() {
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILDS],
    })
    this.client.login(process.env.TOKEN)
  }

  startBot() {
    this.login()
    this.initEventHandler()
  }

  initEventHandler() {
    this.eventHandler = new EventHandler(this.client)
    this.eventHandler.addSubscriber(this)
    // this.client.on('messageCreate', this.eventHandler.onMessage)
  }

  async joinChannel(channelDetails) {
    //console.log('trying to join ' + channel)
    // joinVoiceChannel()
    this.voiceChannelConnection = joinVoiceChannel({
      channelId: channelDetails.id,
      guildId: channelDetails.guild.id,
      adapterCreator: channelDetails.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false,
    })
    console.log(this.voiceChannelConnection)
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
