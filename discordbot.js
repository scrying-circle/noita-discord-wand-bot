import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

import {drawSpellEmbed, drawSpellCanvas, drawWandList} from './display.mjs';
import {parseSpellList} from './parse.mjs';
import {wandUpload} from './wands.mjs';
import {spellList, spellNames} from './globals.mjs';


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {

	if (message.author.bot) return;
	//message.channel.send("Recieved!")

	if (message.content.startsWith('.display')) {
		let spells = parseSpellList(message.content.slice(8), spellList, spellNames);
		let canvas_promise = drawSpellCanvas(spells);
		canvas_promise.then((canvas) => {
			let embed = drawSpellEmbed(canvas, spells);
			message.channel.send(embed);
		});
	} else if (message.content.startsWith('.upload')) {
		let wandList = wandUpload(message);
		wandList.then((wands) => {
			let embedList = drawWandList(wands);
			for (let i = 0; i < embedList.length; i++) {
				embedList[i].then((embed) => {
					message.channel.send(embed);
				})
			}
		});
	}
})
client.login('');
