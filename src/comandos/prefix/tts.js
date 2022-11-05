const { MessageEmbed } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, voiceDiscord, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { getAudioUrl } = require('google-tts-api');
const { canal, role } = require('../../../src/util/config.json')

exports.run = async (client, message, args) => {

    //Canal / Role
    if(message.channel.id === canal) {
        if(message.member.roles.cache.find(role => role.id === '966753946511237150')){

        //Casso o usuário não esteja no canal de voz.
        if(!message.member.voice.channel)
            return message.reply(`**${message.author.username}**, entre em um **canal de voz**. \nDepois que você entrar em um **canal de voz**, digite o comando novamente.`)
            
        //Caso a usuário esqueça de digitar uma palavra.
        if(!args.length)
            return message.reply(`**${message.author.username}**, você esqueceu digitar o que você queria falar.`);

        //Mensagem do usuário.
        const mensagem = `${message.author.username} disse`+ args.join(' ')
        if(mensagem.length > 200) 
            return message.reply(`**${message.author.username}**, a **nina** não consegue falar mais de **200** letras.`);

        //Sistema para conectar no voice.
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.channel.guild.id,
            adapterCreator: message.channel.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false,
            volume: 200
        });

        //TTS - Google Package
        const tts = await getAudioUrl(mensagem, {
            lang: 'pt-br',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000
            //splitPunct: ',.?!'
        })

        //Play.
        const player = createAudioPlayer();
        const resource = createAudioResource(tts);
        player.play(resource);
        connection.subscribe(player);

        //Embed
        const embed = new MessageEmbed()
        .setTitle(`nina está aqui para ajudar ${message.author.username}`)
        .setDescription(`**${message.author.username}** disse: \`\`\`${args.join(' ')}\`\`\``)
        .setColor("#FFFFFF")
        return message.reply({ embeds: [embed] })

        //Bot vai deixar o canal quando a mensagem for enviada.
        //Eu prefiro remover essas 3 linhas. 
        //e melhor deixar o bot sempre no canal.
        player.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
        });
} 
    return message.reply(`Apenas os usuários que possui o cargo <@&${role}> \nTem permissão para usar o comando **TTS**.`);
 
}
   return message.reply(`Use o comando de **TTS** no canal <#${canal}>`);
}
