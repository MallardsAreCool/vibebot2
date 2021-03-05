require('dotenv').config();
const Discord = require('discord.js');
//const fs = require('fs');
const client = new Discord.Client();
const TOKEN = process.env.TOKEN;

//let JSONpath = 'strikes.JSON';
//let JSONdata = JSON.parse(fs.readFileSync(JSONpath));

client.login(TOKEN);

var time = new Date().getTime();
var joinTime = new Date().getTime();

client.once('ready', () => {
	console.info(`Logged in as ${client.user.tag}!`);
	client.user.setActivity(`With People's Emotions`, {
		type: 1,
	});
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
	let newUserChannel = newMember.voiceChannel;
	let oldUserChannel = oldMember.voiceChannel;

	if (oldUserChannel === undefined && newUserChannel !== undefined) {
		joinTime = Date.now();
	} else if (newUserChannel === undefined) {
		//init person to json
		//console.log(newMember.id);
		time = Date.now() - joinTime;
	}
});

function msToTime(duration) {
	var milliseconds = parseInt((duration % 1000) / 100),
		s = Math.floor((duration / 1000) % 60),
		m = Math.floor((duration / (1000 * 60)) % 60),
		h = Math.floor((duration / (1000 * 60 * 60)) % 24);

	return h + ' Hours, ' + m + ' Minutes, ' + s + ' Seconds';
}

client.on('message', (message) => {
	if (message.content == 'time') {
		message.channel.send(msToTime(time));
	}
	{
		// let messageToLowercase = message.content.replace(/\s/g, '').toLowerCase();
		// if (message.author.bot) return;
		// if (message.channel.name.toLowerCase() == WORD) {
		// 	if (!validMeat(messageToLowercase)) {
		// 		if (!JSONdata[message.author.id]) {
		// 			JSONdata[message.author.id] = {
		// 				username: `${message.author.username}`,
		// 				strikes: 0,
		// 			};
		// 		}
		// 		JSONdata[message.author.id].strikes++;
		// 		fs.writeFileSync(JSONpath, JSON.stringify(JSONdata, null, 2));
		// 		console.log(JSONdata[message.author.id].strikes);
		// 		let msg = `${message.author}, you fool. you absolute buffoon. you think you can challenge me in my own realm? you think you can rebel against my authority? you dare come into my house and upturn my dining chairs and spill coffee grounds in my Keurig? you thought you were safe in your chain mail armour behind that screen of yours. I will take these laminated wood floor boards and destroy you. I didn't want war. but i didn't start it.\n\nIt is illegal to say anything but **${WORD}** in this server.`;
		// 		if (message.author.id == ownerID) {
		// 			message.channel.send(msg);
		// 		} else if (JSONdata[message.author.id].strikes == 1) {
		// 			message.channel.send(msg + ` Strikes: ${JSONdata[message.author.id].strikes}/3`);
		// 		} else if (JSONdata[message.author.id].strikes == 2) {
		// 			message.channel.send(msg + ` __Strikes: ${JSONdata[message.author.id].strikes}/3__`);
		// 		} else if (JSONdata[message.author.id].strikes == 3) {
		// 			message.channel.send(msg + ` **__Strikes: ${JSONdata[message.author.id].strikes}/3__**`);
		// 		} else if (JSONdata[message.author.id].strikes >= 4) {
		// 			message.member.send(`https://discord.gg/b5jhFfKJWe`).then(() => {
		// 				message.member.kick('VibeBot is disappointed in you.');
		// 			});
		// 		}
		// 	}
		// }
	}
});
