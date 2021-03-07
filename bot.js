require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
const TOKEN = process.env.TOKEN;

let JSONpath = 'users.JSON';
let JSONdata = JSON.parse(fs.readFileSync(JSONpath));

client.login(TOKEN);

client.once('ready', () => {
	console.info(`Logged in as ${client.user.tag}!`);
	client.user.setActivity(`With People's Emotions`, {
		type: 1,
	});
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
	let newUserChannel = newMember.channelID;

	if (newUserChannel === null || newUserChannel == newMember.guild.afkChannelID) leaveCall(newMember.id);
	else joinCall(newMember.id);
});

function joinCall(memberID) {
	if (JSONdata[memberID].inCall) return;
	else {
		console.log('join');

		JSONdata[memberID].inCall = true;

		updateTime(memberID);
	}
}

function leaveCall(memberID) {
	console.log('leave');

	JSONdata[memberID].inCall = false;

	updateTime(memberID);
}

function updateTime(memberID) {
	if (!JSONdata[memberID]) {
		JSONdata[memberID] = {
			timeInVC: 0,
			inCall: false,
			joinTime: 0,
		};
	}

	if (JSONdata[memberID].joinTime != 0) JSONdata[memberID].timeInVC += Date.now() - JSONdata[memberID].joinTime;

	if (JSONdata[memberID].inCall) JSONdata[memberID].joinTime = Date.now();
	else JSONdata[memberID].joinTime = 0;

	fs.writeFileSync(JSONpath, JSON.stringify(JSONdata, null, 2));
}

function msToTime(duration) {
	var s = Math.floor((duration / 1000) % 60),
		m = Math.floor((duration / (1000 * 60)) % 60),
		h = Math.floor((duration / (1000 * 60 * 60)) % 24),
		d = Math.floor((duration / (1000 * 60 * 60 * 24)) % 7);

	return [d, h, m, s];
}

function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

client.on('message', (message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith('!')) return;

	var userInput = message.content.substr(1).toLocaleLowerCase();
	var command = userInput.split(' ')[0];
	var args = userInput.split(' ')[1];

	if (command == 'time') {
		var user = getUserFromMention(args) || message.author;

		if (!user.bot) {
			updateTime(user.id);

			var time = msToTime(JSONdata[user.id].timeInVC);
			var responce = `${user.username} has been in VC for: `;

			if (time[0] != 0) responce += `**${time[0]}** days, `;
			if (time[1] != 0) responce += `**${time[1]}** hours, `;
			if (time[2] != 0) responce += `**${time[2]}** minutes and `;
			responce += `**${time[3]}** seconds! `;
			if (time[3] == 0) responce += 'How sad :(';

			message.channel.send(responce);
		} else message.channel.send('Yo why you bringing bots into this?');
	}
});
