require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const { join } = require('path');
const client = new Discord.Client();
const TOKEN = process.env.TOKEN;

let JSONpath = 'users.JSON';
let JSONdata = JSON.parse(fs.readFileSync(JSONpath));

client.login(TOKEN);

var joinTime = Date.now();
var currentTime = Date.now();

client.once('ready', () => {
	console.info(`Logged in as ${client.user.tag}!`);
	client.user.setActivity(`With People's Emotions`, {
		type: 1,
	});
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
	let newUserChannel = newMember.channelID;

	if (newUserChannel !== null) {
		if (JSONdata[newMember.id].inCall) return;
		else {
			console.log('join');

			joinTime = Date.now();
			JSONdata[newMember.id].inCall = true;
			fs.writeFileSync(JSONpath, JSON.stringify(JSONdata, null, 2));
		}
	} else {
		console.log('leave');

		JSONdata[newMember.id].inCall = false;
		fs.writeFileSync(JSONpath, JSON.stringify(JSONdata, null, 2));

		if (!JSONdata[newMember.id]) {
			JSONdata[message.author.id] = {
				timeInVC: 0,
				inCall: false,
			};
		}

		JSONdata[newMember.id].timeInVC += Date.now() - joinTime;
		fs.writeFileSync(JSONpath, JSON.stringify(JSONdata, null, 2));
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
		message.channel.send(msToTime(JSONdata[message.author.id].timeInVC));
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
