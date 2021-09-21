const prefix = '!b'

const ytdl = require('ytdl-core-discord')

class EventHandler {
  client
  bombaSubscribers

  constructor(client, options) {
    console.log('EventHandler created')
    this.client = client
    this.startEventListener()
    this.setOptions()
    this.bombaSubscribers = []
  }

  addSubscriber(subscriber) {
    this.bombaSubscribers.push(subscriber)
  }

  startEventListener() {
    this.client.on('messageCreate', this.onMessage.bind(this))
    this.client.on('voiceStateUpdate', this.onVoiceStateUpdate.bind(this))
  }

  setOptions(optionsObject) {}

  async onMessage(message) {
    if (message.author.bot) return

    // console.log(message.cleanContent)

    if (!message.cleanContent.startsWith(prefix)) {
      console.log('missing prefix')
      return
    }

    let cleanCommand = message.cleanContent.split(' ')[1].trim() ? message.cleanContent.split(' ')[1].trim() : false
    // console.log(message.member.voice.channel)

    if (cleanCommand === 'join') {
      this.bombaSubscribers.forEach((bombaSub) => {
        console.log('should join')
        //console.log(message.member.voice.channel)
        bombaSub.joinChannel(message.member.voice.channel)

        //sub.joinChannel(await message.member.voice.channel)
      })
      return
    }

    if (cleanCommand === 'play') {
      if (ytdl.validateURL(message.cleanContent.split(' ')[2].trim())) {
        console.log('valid u2b url')
        const songInfo = await ytdl.getInfo(message.cleanContent.split(' ')[2].trim())
        let song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
        }

        //let stream = await ytdl(song.url, { highWaterMark: 1 << 25 })
        this.bombaSubscribers[0].forwardAudioRequest(await ytdl(song.url, { highWaterMark: 1 << 25 }))
      } else {
        console.log('not valid url')
      }
    }

    //message.reply('0w0')
  }

  onVoiceStateUpdate(oldState, newState) {
    console.log('a voice state update happened!')
    if (oldState.channel === null) {
      console.log('somebody joined, should play sauna file')
      return
    }
    // When user leaves
    else if (newState.channel === null) {
      console.log('should play yoda audio file')
      return
    } else {
      console.log('other voice state event happened')
    }
  }
}

module.exports = EventHandler
