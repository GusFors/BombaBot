require('dotenv').config()
const Discord = require('discord.js')
const ytdl = require('ytdl-core-discord')
//const ytdl = require('ytdl-core') gamla
const yts = require('yt-search')
const fs = require('fs')
const bent = require('bent')
const getBuffer = bent('buffer')
const client = new Discord.Client()
const prefix = '!b'
client.login(process.env.TOKEN)
const messageArray = ['still here...']

let connection
let isConnectedToVoiceChannel
const preventNoVoiceChatUsersFromCallingBot = false
let reactWithCatOnEveryMessage = false
let currentVolume = 1
let dispatcher
let audioQueue = []

client.on('message', async function (message) {
  try {
    // prevents replying to bots
    if (message.author.bot) return

    if (reactWithCatOnEveryMessage === true) {
      const reactionEmoji = message.guild.emojis.cache.find((emoji) => emoji.name === 'seriousCat')
      message.react(reactionEmoji)
    }

    // prevents further execution when message is not meant for bot
    if (!message.content.startsWith(prefix)) {
      return
    }

    if (message.attachments.first()) {
       // TODO not arb timeouts 
      let download = await getBuffer(message.attachments.first().url)
      setTimeout(() => {
        fs.open('./audioFiles/nyFil.mp3', 'w+', function (err, fd) {
          fs.write(fd, download, 0, download.length, null, function (err, writtenbytes) {})
        })
      }, 3000)

      setTimeout(async () => {
        connection = await message.member.voice.channel.join()
        isConnectedToVoiceChannel = true
        dispatcher = connection.play('./audioFiles/nyFil.mp3')
        dispatcher.setVolume(currentVolume)
      }, 7000)

      // fs.write('nyFil.png', download)
      message.reply('you sent me a file, playing it soon...!!!')
      return
    }

    // No action if message sender is not currently in a voice channel
    if (!message.member.voice.channel && preventNoVoiceChatUsersFromCallingBot === true) {
      message.reply('can not comprendo, you are probably not currently in a voice channel')
      return
    }

    if (message.cleanContent.split(' ')[1] === undefined) {
      message.reply('What do you want from me??')
      return
    }

    let actionCommand = message.cleanContent.split(' ')[1].trim() ? message.cleanContent.split(' ')[1].trim() : false

    // Bot joins voice channel if the message sender is currently in a voice channel
    if (actionCommand === 'join') {
      connection = await message.member.voice.channel.join()
      isConnectedToVoiceChannel = true
      dispatcher = connection.play('./audioFiles/vbrazil.mp3')
      dispatcher.setVolume(currentVolume)
      message.reply("It's Bomba time!! ")
      return
    }
    // Bot leaves voice the messagers voice channel
    else if (actionCommand === 'leave') {
      message.member.voice.channel.leave()
      isConnectedToVoiceChannel = false
      return
    }
    // sets dispatcher volume from user input
    else if (actionCommand === 'volume') {
      let volume = parseInt(message.cleanContent.split(' ')[2].trim()) / 100
      currentVolume = volume
      dispatcher.setVolume(currentVolume)

      message.reply(`Volume set to: ${currentVolume * 100}, (${currentVolume})`)
      return
    }
    // testing replies and reactions
    else if (message.cleanContent.trim().toLowerCase() === `${prefix} i love you`) {
      const reactionEmoji = message.guild.emojis.cache.find((emoji) => emoji.name === 'seriousCat')
      message.react(reactionEmoji)
      message.reply('Love from bomba')
      return
    }

    // playing audio
    else if (actionCommand === 'play') {
      if (!isConnectedToVoiceChannel) {
        connection = await message.member.voice.channel.join()
        isConnectedToVoiceChannel = true
      }

      if (message.cleanContent.split(' ')[2].trim() === 'lmt') {
        dispatcher = connection.play('./audioFiles/letMeTalk.mp3')
        dispatcher.setVolume(currentVolume)
        return
      }

      if (message.cleanContent.split(' ')[2].trim() === 'brazil') {
        dispatcher = connection.play('./audioFiles/vbrazil.mp3')
        dispatcher.setVolume(currentVolume)
        return
      }

      if (message.cleanContent.split(' ')[2].trim() === 'what') {
        dispatcher = connection.play('./audioFiles/waitWhat.mp3')
        dispatcher.setVolume(currentVolume)
        return
      }

      if (message.cleanContent.split(' ')[2].trim() === 'yoda') {
        dispatcher = connection.play(await ytdl('https://www.youtube.com/watch?v=6yisws5rKoo'), { type: 'opus' })
        dispatcher.setVolume(currentVolume)
        return
      }

      if (!message.cleanContent.split(' ')[2]) {
        dispatcher = connection.play('./audioFiles/drums.wav')
        dispatcher.setVolume(currentVolume)
        return
      }

      let song
      if (ytdl.validateURL(message.cleanContent.split(' ')[2].trim())) {
        console.log('valid u2b url')
        const songInfo = await ytdl.getInfo(message.cleanContent.split(' ')[2].trim())
        song = {
          title: songInfo.videoDetails.title,
          url: songInfo.videoDetails.video_url,
        }

        playAudioQueue = (playAudioQueue) => {
          stream.on('finish', async function () {
            audioQueue.shift()
            console.log('stream finished')
            console.log(audioQueue)

            let stream = await ytdl(audioQueue[0], { highWaterMark: 1 << 25 })
            dispatcher = connection.play(stream, { type: 'opus' })
            message.reply(`Now playing: ${audioQueue[0]}`)
          })
        }

        let stream = await ytdl(song.url, { highWaterMark: 1 << 25 })

        stream.on('finish', async function () {
          audioQueue.shift()
          console.log('stream finished')

          if (audioQueue.length > 0) {
            dispatcher = connection.play(audioQueue[0].stream, { type: 'opus' })
            dispatcher.setVolume(currentVolume)
            message.reply(`Now playing: ${audioQueue[0].songUrl}, remaining arrayItems: ${audioQueue.length}`)
          }
        })

        if (audioQueue.length === 0) {
          dispatcher = connection.play(stream, { type: 'opus' })
          dispatcher.setVolume(currentVolume)

          message.reply(`Now playing: ${song.url}`)
          audioQueue.push({ stream: stream, songUrl: song.url })
        } else if (audioQueue.length > 0) {
          audioQueue.push({ stream: stream, songUrl: song.url })
          message.reply('position ' + audioQueue.length + ' in queue')
        }
        return
      } else {
        const { videos } = await yts(message.cleanContent.replace(/!b play/g, ''))
        console.log(message.cleanContent.replace(/play/g, ''))

        if (!videos.length) return message.channel.send('No songs were found!')

        song = {
          title: videos[0].title,
          url: videos[0].url,
        }

        let stream = await ytdl(song.url, { highWaterMark: 1 << 25 })

        stream.on('finish', async function () {
          // removes the first item in the queue array
          audioQueue.shift()
          console.log('stream finished')

          if (audioQueue.length > 0) {
            dispatcher = connection.play(audioQueue[0].stream, { type: 'opus' })
            dispatcher.setVolume(currentVolume)
            message.reply(`Now playing: ${audioQueue[0].songUrl}, remaining arrayItems: ${audioQueue.length}`)
          }
        })

        if (audioQueue.length === 0) {
          dispatcher = connection.play(stream, { type: 'opus' })
          dispatcher.setVolume(currentVolume)

          message.reply(`Now playing: ${song.url}`)
          audioQueue.push({ stream: stream, songUrl: song.url })
        } else if (audioQueue.length > 0) {
          audioQueue.push({ stream: stream, songUrl: song.url })
          message.reply('position ' + audioQueue.length + ' in queue')
        }
        return
      }
    } else if (actionCommand === 'skip') {
      console.log('should skip')
      audioQueue[0].stream.destroy()
      audioQueue.shift()

      if (audioQueue.length > 0) {
        dispatcher = connection.play(audioQueue[0].stream, { type: 'opus' })
        dispatcher.setVolume(currentVolume)
        message.reply(`Now playing: ${audioQueue[0].songUrl}, remaining arrayItems: ${audioQueue.length}`)
      }
      return
    }

    return message.reply(message.cleanContent + '?' + ' ' + messageArray[Math.floor(Math.random() * messageArray.length)])
  } catch (error) {
    message.reply('Oops, something went wrong, or you are restricted from calling me. Try again')
    console.log(error)
  }
})

client.on('voiceStateUpdate', async (oldState, newState) => {
  try {
    if (audioQueue.length < 1) {
      if (isConnectedToVoiceChannel) {
        // When user joins voice
        if (oldState.channel === null) {
          dispatcher = connection.play('./audioFiles/saunaWelcome.mp3')
          dispatcher.setVolume(currentVolume)
          return
        }
        // When user leaves
        else if (newState.channel === null) {
          dispatcher = connection.play(await ytdl('https://www.youtube.com/watch?v=6yisws5rKoo'), { type: 'opus' })

          return
        } else {
          // console.log('other voice state event happened')
        }
      }
    }
  } catch (error) {
    console.log(error)
  }
})
