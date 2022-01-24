'use strict'

const { Client, Intents } = require('discord.js')
const {
  generateDependencyReport,
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  entersState,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
  createAudioResource,
} = require('@discordjs/voice')

const EventHandler = require('./EventHandler')
const AudioHandler = require('./AudioHandler')

class BombaBot {
  client
  eventHandler
  voiceChannelConnection
  audioPlayer
  audioHandler

  constructor() {
    console.log('I have been created!!!!')
    this.audioPlayer = new AudioPlayer()
    this.audioHandler = new AudioHandler(this.voiceChannelConnection)
  }

  login() {
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES],
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

    // this.audioPlayer = createAudioPlayer()
    this.audioHandler.setVoiceChannelConnection(this.voiceChannelConnection)
    this.audioHandler.playAudioFromFileName('./audioFiles/vbrazil.mp3')
    // console.log(this.audioPlayer)
  }

  forwardAudioRequest(audio) {
    this.audioHandler.playAudioFromStream(audio)
  }
}

module.exports = BombaBot
