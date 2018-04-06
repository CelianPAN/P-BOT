const Discord = require('discord.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('database.json');
const db = low(adapter);

db.defaults({ blagues: [], xp: []}).write()

var bot = new Discord.Client();
var prefix = (";");
var randnum = 0;

var owner = '271281442170863619'

var blaguenumber = db.get('blagues').map('blague_value').value();


bot.on('ready', () => {
    bot.user.setPresence({ game: { name: ';help [BOT CRÉÉ PAR CÉLIAN PAN] ', type : 0} });
    console.log("Bot Ready !");
});

bot.login('client.login(process.env.TOKEN);');

bot.on("guildMemberAdd", member => {
    member.guild.channels.find("name", "general").send(`:rainbow: ${member.user.username} viens de nous rejoindre ! Bienvenue à lui :grinning: !`)
})

bot.on("guildMemberRemove", member => {
    member.guild.channels.find("name", "general").send(`:rice_scene: ${member.user.username} viens de nous quitter :sleepy: ! Qu'il repose en paix... `)
})

bot.on('message', message => {

    var msgauthor = message.author.id;

    if(message.author.bot)return;

    if(!db.get("xp").find({user: msgauthor}).value()){
        db.get("xp").push({user: msgauthor, xp: 1}).write();
    }else{
        var userxpdb = db.get("xp").filter({user: msgauthor}).find('xp').value();
        console.log(userxpdb);
        var userxp = Object.values(userxpdb)
        console.log(userxp);
        var user_namex = message.author.username.toString();
        console.log(`Nombre d'xp : ${userxp[1]}`)

        db.get("xp").find({user: msgauthor}).assign({user_name: user_namex, user: msgauthor, xp: userxp[1] += 1}).write();

    }
    
    
    if (message.content === "ping"){
        message.reply('pong :joy:')
        console.log('ping pong');
    }

    if (message.content === "Ah"){
        message.reply('b (je kiff mon humour)')
        console.log('ah b');
    }

    if (message.content === "<@373586712414388224>"){
        message.reply('Tu as mentionné le GRAND sauron sans écrire de message ! TU VEUX DÉRANGER UN DIEUX ?!?!')
        console.log("sauron")
    }

    if (message.content === "<@377888169355640832>"){
        message.reply('Tu as mentionné mon copain chat :cat: !')
        console.log("nya bot")
    }

    if (message.content === "<@271281442170863619>"){
        message.reply('Tu as mentionné mon créateur !')
        console.log("owner")
    }

    if (message.content === "<@412597505679818752>"){
        message.reply('Oui je suis là :wave: !')
        console.log("coucou")
    }

    if (message.content === "Mathis"){
        message.reply('Grillet Munier')
        console.log("mat")
    }

    if (!message.content.startsWith(prefix)) return;
    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()){
        
        case "newblague":
        
        message.delete(500)
        var value = message.content.substr(11);
        var author = message.author.toString();
        var author_name = message.author.username.toString();
        var number = db.get('blagues').map('id').value();
        console.log(value);
        message.reply("Ajout de la blague dans la base de données ...")

        db.get('blagues')
            .push({ blague_value: value, blague_author_id: author, blague_author_username: author_name})      
            .write();
        break;

        //case "tellblague" :

        blague_random();
        console.log(randnum);

        var blague = db.get(`blagues[${randnum}].blague_value`).toString().value();
        var author_blague = db.get(`blagues[${randnum}].blague_author`).toString().value();
        console.log(blague);

        message.channel.send(`Voici une blague : ${blague} (Blague de ${author_blague})`)
        
        break; 
       
        
        case "kick":

        if (!message.channel.permissionsFor(message.member).hasPermission("KICK_MEMBERS")){
            message.channel.send(":loudspeaker: Tu n'as pas la permission de kick !")
        }else{
            var memberkick = message.mentions.users.first();
            
            if(!memberkick){
                message.channel.send(":loudspeaker: Utilisateur introuvable !");
            }else{
                if(!message.guild.member(memberkick).kickable){
                    message.channel.send(":loudspeaker: Je n'ai pas la permission de kick cet utilisateur (peut être que mon grade n'est pas assez haut)");
                }else{
                message.guild.member(memberkick).kick().then((member) => {
                message.channel.send(`:rotating_light: ${member.displayName} a été kick !`);
                }).catch(() => {
                message.channel.send(":loudspeaker: Kick refusé !")
                })
            }
        }
        }
        break;


        case "ban":

        if (!message.channel.permissionsFor(message.member).hasPermission("BAN_MEMBERS")){
            message.channel.send(":loudspeaker: Tu n'as pas la permission de ban !")
        }else{
            var memberban = message.mentions.users.first();

            if(!memberban){
                message.channel.send(":loudspeaker: Utilisateur introuvable !");
            }else{
                if(!message.guild.member(memberban).bannable){
                    message.channel.send(":loudspeaker: Je n'ai pas la permission de ban cet utilisateur (peut être que mon grade n'est pas assez haut)");
                }else{
                message.guild.member(memberban).ban().then((member) => {
                message.channel.send(`:rotating_light: ${member.displayName} a été ban !`);
                }).catch(() => {
                message.channel.send(":loudspeaker: Ban refusé !")
                })
            }
        }
        }
        break;

    case "talk":

    var talk = message.content.substr(6);
    message.reply(talk)
    message.delete(500)
    console.log("talk")

    break;

    case "stats":

    var userXpDb = db.get("xp").filter({user: msgauthor}).find("xp").value();
    var userXP = Object.values(userXpDb);
    var userCreateDate = message.author.createdAt.toString().split(' ')

    var stats_embed = new Discord.RichEmbed()
        .setColor('#A105C8')
        .setTitle(`Stats de: ${message.author.username}`)
        .addField("XP", `${userXP[1]} XP`, true)
        .addField("ID de l'utilisateur", msgauthor, true)
        .addField("Date de création de l'utilisateur", userCreateDate[1] + ' ' + userCreateDate[2] + ', ' + userCreateDate[3])
        .setThumbnail(message.author.avatarURL)

    message.channel.send({embed: stats_embed})

    break;
    
    case "log":
    
    message.delete(500)
    var log_write = message.content.substr(5)
    message.reply(`J'ai écrit ${log_write} dans la console !`)
    .then(msg => {
        msg.delete(10000)
    });
    console.log(log_write);
    

    break;

    case "ownertalk":

    if (message.author.id == owner) {
    var owner_talk = message.content.substr(11)
    message.delete(500)
    message.channel.send(owner_talk)
    }
    else {
        message.reply("Tu n'as pas le droit d'executer cette commande !")
    }

    }


    if (message.content === prefix + "help"){
        message.reply("Je t'ai envoyé la liste des commandes en MP !")
        .then(msg => {
            msg.delete(10000)
        });
        message.delete(10000)
        var help_embed = new Discord.RichEmbed()
        .setColor('#66D238')
        .addField("Commandes du bot", "  **;help** : Affiche les commandes du bot \n**;chou** : Affiche une image mignonne au hasard \n**;log <message>** : Permet d'écrire dans la console \n**;xp** : Affiche votre nombre d'xp (1 message = 1 xp)\n**;stats** : Affiche vos stats \n**;invite** : Affiche le lien d'invitation du bot\n**;talk** <message> : Permet de faire parler le bot (avec mention) \n**;kick** <mention> : Permet de kick l'utilisateur mentionné (réservé aux mod/admin) \n**;ban** <mention> : Permet de ban l'utilisateur mentionné (réservé aux mod/admin)")
        .addField("Interactions (sans le préfixe)", "**ping** : Le bot répond pong \n**ah** : Le bot répond b")
        .addField("Base de données", "**;newblague** : Ajoute une blague dans la base de données")
        .addField("Commande réservées à l'owner", "**;ownertalk <message>** : Permet de faire écrire le bot (sans mention)")
        .addField("Commande désactivées", "**;tellblague** : Permet de lire une blague de la base de données \n*__Raison__*: __Cette commande a été désactivée en raison de bug__ (Je travaille dessus)")
        .setFooter("C'est tout pour le moment !")
        message.author.sendEmbed(help_embed);
        console.log("help")
    }

    if (message.content === prefix + "invite"){
        message.reply("Voici le lien pour inviter le bot sur un serveur : https://discordapp.com/oauth2/authorize?client_id=412597505679818752&scope=bot&permissions=2146958591")
        console.log("invitation bot")
    }

    if (message.content === prefix + "chou"){
        random();

        if (randnum == 0){
            message.reply("Voici une image kawaï :cat: : https://www.wikichat.fr/wp-content/uploads/sites/2/comment-soigner-une-plaie-dun-chat.jpg")
            console.log("kawai 1")
        }

        if (randnum == 1){
            message.reply("Voici une image kawaï :cat: : http://i.imgur.com/kkqZHi8.jpg");
            console.log("kawai 2");
        }

        if (randnum == 2){
            message.reply("Voici une image kawaï :cat: : https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBvORlETA2KGz95tGZHAGti4TWphRYTHc-H14niFvHYk-3-tEK");
            console.log("kawai 3")
        }

        if (randnum == 3){
            message.reply("Voici une image kawaï :cat: : http://www.assuropoil.fr/wp-content/uploads/assurance-chat-assurer-son-chat1.jpg")
            console.log("kawai 4")
        }


    }

    if (message.content === prefix + "xp"){
        var xp = db.get("xp").filter({user: msgauthor}).find('xp').value()
        var xpfinal = Object.values(xp);
        var xp_embed = new Discord.RichEmbed()
            .setTitle(`Xp de ${message.author.username}`)
            .setDescription("Voici tout vos xp ! Vos xp sont conservé d'un serveur à un autre (1 message vous donne 1xp)")
            .addField("XP :", `${xpfinal[1]} xp`)
            .setColor('#5A7FD4')
        message.channel.send({embed: xp_embed});
    }

});

function blague_random(min, max) {
        min = Math.ceil(1);
        max = Math.floor(blaguenumber);
        randnum = Math.floor(Math.random() * (max - min + 1) + min);

}

function random(min, max) {
    min = Math.ceil(0);
    max = Math.floor(3);
    randnum = Math.floor(Math.random() * (max - min + 1) + min);
}
