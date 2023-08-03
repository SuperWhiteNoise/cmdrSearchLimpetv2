const { Client, IntentsBitField } = require("discord.js");
const config = require("../config.json");
const utils = require("../utils");
const inara = require("../inara");
const sql = require("../sql");
const date = new Date().toISOString();
const limpetComebacks = require("./limpetComebacks.json");

sql.createDB(); //creates the sqlite3 db

const client = new Client({ //bot permissions
	intents: [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMembers,
		IntentsBitField.Flags.GuildMessages,
		IntentsBitField.Flags.MessageContent
	]
});

client.on('ready', async (c) => { //login the bot
	console.log(`${date} : ${c.user.tag} online`);
});

client.on('messageCreate', async (message) => { //commands section

	if (message.content == `${config.prefix}h`) { //help command
		console.log(`${date} ${message.author.username} used the help command`);
		const help = await utils.getHelp();
		message.reply({ embeds: [help] });
	}

	if (message.content == `${config.prefix}j`) { //joke command
		console.log(`${date} ${message.author.username} used the joke command`);
		const joke = await utils.getRandomJoke();
		message.reply(joke);
	}

	if (limpetComebacks[message.content]) { //this needs a rework
		console.log(`I came up with a witty comeback to ${message.author.username}'s comment`);
		message.channel.send(limpetComebacks[message.content]);
	}

	if (message.content.startsWith(`${config.prefix}w`)) { //inara lookup
		let rawSearchName = message.content.slice(3);
		if (rawSearchName.length == 0) { //handle if the command is blank
			console.log(`${date} user ${message.author.username} searched for a blank username`);
			const blankMessage = await utils.blankLookupHelp();
			message.reply({ embeds: [blankMessage] });
		} else {
			let formattedSearchName = rawSearchName.toLowerCase();
			console.log(`${date} user ${message.author.username} searched for ${formattedSearchName}`);
			const lookupResult = await inara.apiLookup(formattedSearchName);
			message.reply({ embeds: [lookupResult] });
		}
	}

	if (message.content.startsWith(`${config.prefix}s`)) { //db lookup
		let rawSearchName = message.content.slice(3);
		if (rawSearchName.length == 0) { //handle if the command is blank
			console.log(`${date} user ${message.author.username} searched my database for a blank username`);
			const blankMessage = await utils.blankLookupSqlHelp();
			message.reply({ embeds: [blankMessage] });
		} else {
			console.log(`${date} user ${message.author.username} searched my database for: ${rawSearchName}`);
			let formattedSearchName = rawSearchName.toLowerCase();
			let searchedCmdrStatus = await sql.wrapperSelect(`SELECT status FROM lookup WHERE name = "${formattedSearchName}"`);
			let searchedCmdrStatusUpdatedBy = await sql.wrapperSelect(`SELECT by FROM lookup WHERE name = "${formattedSearchName}"`);
			let searchedCmdrStatusDateTime = await sql.wrapperSelect(`SELECT datetime FROM lookup WHERE name = "${formattedSearchName}"`);
			if (searchedCmdrStatus.length == 0) { //not in db at all
				let status = -1;
				if (status == -1) {
					const returnMessage = await utils.notFoundCmdr(formattedSearchName);
					message.reply({ embeds: [returnMessage] });
				}
			} else {
				let status = searchedCmdrStatus[0].status; //known names
				if (status == 0) { //unknown
					const returnMessage = await utils.unknownCmdr(formattedSearchName);
					message.reply({ embeds: [returnMessage] });
				}
				if (status == 1) { //friend
					let by = searchedCmdrStatusUpdatedBy[0].by;
					let rawDatetime = parseInt(searchedCmdrStatusDateTime[0].datetime);
					let datetime = new Date(rawDatetime);
					const returnMessage = await utils.friendCmdr(formattedSearchName, by, datetime);
					message.reply({ embeds: [returnMessage] });
				}
				if (status == 2) { //foe
					let by = searchedCmdrStatusUpdatedBy[0].by;
					let rawDatetime = parseInt(searchedCmdrStatusDateTime[0].datetime);
					let datetime = new Date(rawDatetime);
					const returnMessage = await utils.foeCmdr(formattedSearchName, by, datetime);
					message.reply({ embeds: [returnMessage] });
				}
				if (status == 3) { //kos
					let by = searchedCmdrStatusUpdatedBy[0].by;
					let rawDatetime = parseInt(searchedCmdrStatusDateTime[0].datetime);
					let datetime = new Date(rawDatetime);
					const returnMessage = await utils.kosCmdr(formattedSearchName, by, datetime);
					message.reply({ embeds: [returnMessage] });
				}
			}
		}
	}

	if (message.content.startsWith(`${config.prefix}fr`)) { //friend command
		if (message.member.roles.cache.some(role => role.name === 'Paladin')) {
			let currentTime = new Date().getTime();
			let rawCurrentUser = message.member.displayName;
			let currentUser = rawCurrentUser.toLowerCase();
			let rawUpdateName = message.content.slice(4);
			let updateName = rawUpdateName.toLowerCase();
			if (updateName.length == 0) {
				message.reply(`I need a cmdr name for that command to work.\neg; !fr <cmdr_name>`)
			} else {
				console.log(`${date} ${message.author.username} updated ${updateName} to state: friend(1)`);
				await sql.wrapperUpdate(`UPDATE lookup SET status = 1, by = '${currentUser}', datetime = ${currentTime} WHERE name = "${updateName}"`);
				message.reply(`Internal record updated for ${updateName}.\nStatus: Friend o7`);
			}
		} else {
			message.reply(`Sorry, only Paladins are able to update internal records.`);
		}
	}

	if (message.content.startsWith(`${config.prefix}foe`)) { //foe command
		if (message.member.roles.cache.some(role => role.name === 'Paladin')) {
			let currentTime = new Date().getTime();
			let rawCurrentUser = message.member.displayName;
			let currentUser = rawCurrentUser.toLowerCase();
			let rawUpdateName = message.content.slice(5);
			let updateName = rawUpdateName.toLowerCase();
			if (updateName.length == 0) {
				message.reply(`I need a cmdr name for that command to work.\neg; !foe <cmdr_name>`)
			} else {
				console.log(`${date} ${message.author.username} updated ${updateName} to state: foe(2)`);
				await sql.wrapperUpdate(`UPDATE lookup SET status = 2, by = '${currentUser}', datetime = ${currentTime} WHERE name = "${updateName}"`);
				message.reply(`Internal record updated for ${updateName}.\nStatus: Foe`);
			}
		} else {
			message.reply(`Sorry, only Paladins are able to update internal records.`);
		}
	}

	if (message.content.startsWith(`${config.prefix}kos`)) { //kos command
		if (message.member.roles.cache.some(role => role.name === 'Paladin')) {
			let currentTime = new Date().getTime();
			let rawCurrentUser = message.member.displayName;
			let currentUser = rawCurrentUser.toLowerCase();
			let rawUpdateName = message.content.slice(5);
			let updateName = rawUpdateName.toLowerCase();
			if (updateName.length == 0) {
				message.reply(`I need a cmdr name for that command to work.\neg; !kos <cmdr_name>`)
			} else {
				console.log(`${date} ${message.author.username} updated ${updateName} to state: kos(3)`);
				const doTheyExist = await sql.wrapperSelect(`SELECT name FROM lookup WHERE name = "${updateName}"`);
				//this is not working
				if (await doTheyExist !== null) {
					await sql.wrapperUpdate(`UPDATE lookup SET status = 3, by = '${currentUser}', datetime = ${currentTime} WHERE name = "${updateName}"`);
					message.reply(`💥 Kill on sight order issued for ${updateName}.`);
				} else {
					message.reply(`${updateName} does not exist in my database.`);
				}
			}
		} else {
			message.reply(`Sorry, only Paladins are able to update internal records.`);
		}
	}

	if (message.content.startsWith(`${config.prefix}un`)) { //unknown command
		if (message.member.roles.cache.some(role => role.name === 'Paladin')) {
			let currentTime = new Date().getTime();
			let rawCurrentUser = message.member.displayName;
			let currentUser = rawCurrentUser.toLowerCase();
			let rawUpdateName = message.content.slice(4);
			let updateName = rawUpdateName.toLowerCase();
			if (updateName.length == 0) {
				message.reply(`I need a cmdr name for that command to work.\neg; !un <cmdr_name>`)
			} else {
				console.log(`${date} ${message.author.username} updated ${updateName} to state: unknown(0)`);
				await sql.wrapperUpdate(`UPDATE lookup SET status = 0, by = '${currentUser}', datetime = ${currentTime} WHERE name = "${updateName}"`);
				message.reply(`Internal record updated for ${updateName}.\nStatus: Unknown`);
			}
		} else {
			message.reply(`Sorry, only Paladins are able to update internal records.`);
		}
	}

});

client.login(config.token);