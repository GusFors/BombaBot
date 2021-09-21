'use strict'

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

const ytdl = require('ytdl-core-discord')

class AudioHandler {
  audioPlayer
  voiceChannelConnection
  currentResource

  constructor(voiceChannelConnection) {
    this.audioPlayer = new AudioPlayer()
    this.voiceChannelConnection = voiceChannelConnection
  }

  setVoiceChannelConnection(voiceChannelConnection) {
    this.voiceChannelConnection = voiceChannelConnection
  }

  playAudioFromFileName(audioFileName) {
    let resource = createAudioResource(audioFileName)
    this.audioPlayer.subscribe(this.voiceChannelConnection)
    this.audioPlayer.play(resource)
  }

  playAudioFromStream(audioStream) {
    console.log(audioStream)
    let resource = createAudioResource(audioStream)
    this.audioPlayer.subscribe(this.voiceChannelConnection)
    this.audioPlayer.play(resource)
  }
}

module.exports = AudioHandler
