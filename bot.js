require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

let JSONpath = 'users.json';
let JSONdata;
try {
	JSONdata = JSON.parse(fs.readFileSync(JSONpath));
} catch (err) {
	fs.writeFile(JSONpath, '{}', (err) => {
		if (err) throw err;

		console.log('The file was succesfully saved!');
	});
}

client.login(process.env.TOKEN);

client.once('ready', () => {
	console.info(`Logged in as ${client.user.tag}!`);
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
		d = Math.floor(duration / (1000 * 60 * 60 * 24));

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

function getS(time) {
	if (time > 1 || time == 0) return 's';
	else return '';
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

			if (time[0] != 0) {
				responce += `**${time[0]}** day${getS(time[0])}`;
			}
			if (time[1] != 0) {
				if (responce.includes('day')) responce += `, `;
				responce += `**${time[1]}** hour${getS(time[1])}`;
			}
			if (time[2] != 0) {
				if (responce.includes('day')) responce += `, `;
				if (responce.includes('hour')) responce += `, `;
				responce += `**${time[2]}** minute${getS(time[2])}`;
			}
			if (responce.includes('day') || responce.includes('hour') || responce.includes('minute')) responce += ' and ';
			responce += `**${time[3]}** second${getS(time[3])}! `;

			if (time[0] == 69 || time[1] == 69 || time[2] == 69 || time[03] == 69) responce += 'Nice.';
			if (JSONdata[user.id].timeInVC == 0) responce += 'How sad :(';

			message.channel.send(responce);
		} else message.channel.send('Yo why you bringing bots into this?');
	}
});
