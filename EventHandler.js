const prefix = '!b'

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
    // console.log(message.member.voice.channel)

    if (cleanCommand === 'join') {
      this.bombaSubscribers.forEach((bombaSub) => {
        console.log('should join')
        //console.log(message.member.voice.channel)
        bombaSub.joinChannel(message.member.voice.channel)

        //sub.joinChannel(await message.member.voice.channel)
      })
    }

    //message.reply('0w0')
  }
}

module.exports = EventHandler
