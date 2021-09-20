const prefix = '!b'

class EventHandler {
  client
  subscribers

  constructor(client, options) {
    console.log('EventHandler created')
    this.client = client
    this.startEventListener()
    this.setOptions()
    this.subscribers = []
  }

  addSubscriber(subscriber) {
    this.subscribers.push(subscriber)
  }

  startEventListener() {
    this.client.on('messageCreate', this.onMessage.bind(this))
  }

  setOptions(optionsObject) {}

  onMessage(message) {
    if (message.author.bot) return

    // console.log(message.cleanContent)

    if (!message.cleanContent.startsWith(prefix)) {
      console.log('missing prefix')
      return
    }

    let cleanCommand = message.cleanContent.split(' ')[1].trim() ? message.cleanContent.split(' ')[1].trim() : false
    console.log(message.member.voice.channel)

    if (cleanCommand === 'join') {
      this.subscribers.forEach((sub) => {
        console.log('should join')
        //console.log(message.member.voice.channel)
        sub.joinChannel(message.member.voice.channel)

        //sub.joinChannel(await message.member.voice.channel)
      })

      // connection = await message.member.voice.channel.join()
      // isConnectedToVoiceChannel = true
      // dispatcher = connection.play('./audioFiles/vbrazil.mp3')
      // dispatcher.setVolume(currentVolume)
    }

    //message.reply('0w0')
  }
}

module.exports = EventHandler
