const fetch = require("node-fetch");
const config = require("./config.json");
const { EmbedBuilder } = require("discord.js");
const randomJokes = "https://official-joke-api.appspot.com/random_joke";
const limpetImage = "https://static.wikia.nocookie.net/elite-dangerous/images/5/5b/Manticore_Drone.jpg";

class utils {

	async getHelp() { //help command message
		const message = new EmbedBuilder()
			.setColor('#34ebb4')
			.setTitle(`CMDR Search Limpet`)
			.setThumbnail(limpetImage)
			.setDescription(`The limpet that never fails you. Here is my command list:`)
			.addFields(
				{ name: `Help command`, value: `${config.prefix}h : This help message` },
				{ name: `\u200B`, value: `\u200B` },
				{ name: `INARA CMDR lookup`, value: `${config.prefix}w <cmdr name> : I will look up CMDRs on INARA` },
				{ name: `\u200B`, value: `\u200B` },
				{ name: `Internal CMDR lookup`, value: `${config.prefix}s <cmdr name> : I will look up CMDRs in my internal database` },
				{ name: `-Internal Database Commmands-`, value: ` ` },
				{ name: `set friend status`, value: `${config.prefix}fr <cmdr name> : set that cmdr as a friend`, inline: true },
				{ name: `set foe status`, value: `${config.prefix}foe <cmdr name> : set that cmdr as a foe`, inline: true },
				{ name: `set kos status`, value: `${config.prefix}kos <cmdr name> : set that cmdr as kill on sight`, inline: true },
				{ name: `\u200B`, value: `\u200B` },
				{ name: `Want a joke?`, value: `${config.prefix}j : A random joke` }
			)
			.setFooter({ text: `---------------------\nCMDR Search Limpet - Written by CMDR SuperFixxxeR` })
		return message;
	}

	async blankLookupHelp() { //used when a user doesn't sends a blank lookup
		const message = new EmbedBuilder()
			.setColor('#eb3449')
			.setTitle(`Limpet Failed`)
			.setThumbnail(limpetImage)
			.setDescription(`That command requires a CMDR name to work. Here are some examples;`)
			.addFields(
				{ name: `Example 1`, value: `${config.prefix}w <cmdr name>,`, inline: true },
				{ name: `Example 2`, value: `${config.prefix}w saltmine`, inline: true },
				{ name: `Example 3`, value: `${config.prefix}w M. Grey`, inline: true }
			)
		return message;
	}

	async blankLookupSqlHelp() { //used when a user doesn't sends a blank lookup with SQL
		const message = new EmbedBuilder()
			.setColor('#eb3449')
			.setTitle(`Limpet Failed`)
			.setThumbnail(limpetImage)
			.setDescription(`To search my internal database try giving me a CMDR name.`)
			.addFields(
				{ name: `Example`, value: `${config.prefix}s <cmdr name>` }
			)
		return message;
	}

	async getRandomJoke() { //gets jokes from 3rd party site
		try {
			const response = await fetch(randomJokes);
			const data = await response.json();
			const joke = `${await data.setup} ... ${await data.punchline}`;
			return joke;
		} catch (error) {
			console.log(`error collecting joke - code: ${error}`);
		}
	}

	async notFoundCmdr(name) { //for when a user looks up a name from the internal database
		const message = new EmbedBuilder()
			.setColor('#eb3449')
			.setTitle(`CMDR ${name}`)
			.setThumbnail(limpetImage)
			.setDescription(`No internal records on ${name}.`)
			.addFields(
				{ name: `Directive:`, value: `Proceed with caution` }
			)
		return message;
	}

	async unknownCmdr(name) { //for when a user looks up a name from the internal database
		const message = new EmbedBuilder()
			.setColor('#0388fc')
			.setTitle(`CMDR ${name}`)
			.setThumbnail(limpetImage)
			.setDescription(`${name} found, but status is unknown`)
			.addFields(
				{ name: `Directive:`, value: `Determine friend or foe` }
			)
		return message;
	}

	async friendCmdr(name) { //for when a user looks up a name from the internal database
		const message = new EmbedBuilder()
			.setColor('#34ebb4')
			.setTitle(`CMDR ${name}`)
			.setThumbnail(limpetImage)
			.setDescription(`${name} is considered a friend.`)
			.addFields(
				{ name: `Directive:`, value: `o7` }
			)
		return message;
	}

	async foeCmdr(name) { //for when a user looks up a name from the internal database
		const message = new EmbedBuilder()
			.setColor('#eb9c34')
			.setTitle(`CMDR ${name}`)
			.setThumbnail(limpetImage)
			.setDescription(`${name} is considered a foe.`)
			.addFields(
				{ name: `Directive:`, value: `Observe.\nReturn fire if attacked.` }
			)
		return message;
	}

	async kosCmdr(name) { //for when a user looks up a name from the internal database
		const message = new EmbedBuilder()
			.setColor('#eb3449')
			.setTitle(`CMDR ${name}`)
			.setThumbnail(limpetImage)
			.setDescription(`${name} is considered an immediate threat.`)
			.addFields(
				{ name: `Directive:`, value: `💥 Engage.\nKill on sight!` }
			)
		return message;
	}

}

module.exports = new utils;