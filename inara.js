const fetch = require("node-fetch");
const config = require("./config.json");
const { EmbedBuilder } = require("discord.js");
const date = new Date().toISOString();
const limpetImage = "https://static.wikia.nocookie.net/elite-dangerous/images/5/5b/Manticore_Drone.jpg";
const sql = require("./sql");

const statusObject = {
	0: `Unknown`,
	1: `Friend`,
	2: `Foe`,
	3: `Kill On Sight`
};

class inara {

	async getStatus(status) {
		if (await statusObject[Object.keys(statusObject)[await status]]) {
			let theStatus = await statusObject[await status];
			return await theStatus;
		}
	}

	async apiLookup(cmdrName) {
		const payload = { //payload to INARA - should rarely change
			"header": {
				"appName": config.appName,
				"appVersion": "1",
				"isDeveloped": true,
				"APIkey": config.inaraAPIkey,
				"commanderName": config.commanderName
			},
			"events": [{
				"eventName": "getCommanderProfile",
				"eventTimestamp": new Date().toISOString(),
				"eventData": {
					"searchName": await cmdrName
				}
			}]
		}
		const inaraPayload = JSON.stringify(payload);
		try {
			const response = await fetch(config.inaraURL, { //API call to INARA
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: (inaraPayload)
			});
			const data = await response.json();
			const inaraStatus = await data.events[0].eventStatus;
			if (await inaraStatus.toString().startsWith("2")) {
				const inaraData = await data.events[0].eventData;
				console.log(`${date} inara code: ${await inaraStatus}`);
				if (await inaraStatus == 204) { //handle when no results are returned
					const message = new EmbedBuilder()
						.setColor('#eb3449')
						.setTitle(`CMDR not found`)
						.setThumbnail(limpetImage)
						.setDescription(`Search Limpet could not locate CMDR ${cmdrName} on Inara`)
						.addFields(
							{ name: `source: `, value: `[inara](https://inara.cz/)` }
						)
					return message;
				} else if (await inaraStatus == 202) { //handle when partial results are returned
					if (inaraData.hasOwnProperty('commanderSquadron')) {
						let formattedName = await inaraData.userName.toLowerCase();
						await sql.wrapperInsert(`INSERT OR IGNORE INTO lookup (name,status) VALUES ("${formattedName}",0);`);
						let rawStatus = await sql.wrapperSelect(`SELECT status FROM lookup WHERE name = "${formattedName}"`);
						let parsedStatus = await this.getStatus(await rawStatus[0].status);
						const message = new EmbedBuilder()
							.setColor('#eb9c34')
							.setTitle(`CMDR Partial Match Found`)
							.setThumbnail(`${inaraData.avatarImageURL}`)
							.setDescription(`Search Limpet found "${cmdrName}" as:\n[${inaraData.userName}](${inaraData.inaraURL})`)
							.addFields(
								{ name: `${inaraData.commanderSquadron.squadronMemberRank}`, value: `[${inaraData.commanderSquadron.squadronName}](${inaraData.commanderSquadron.inaraURL})` },
								{ name: `Palcon Internal Status:`, value: `${parsedStatus}` },
								{ name: `CMDRs with similar handles found: `, value: `${inaraData.otherNamesFound}` },
								{ name: `source: `, value: `[inara](https://inara.cz/)` }
							)
						return message;
					} else {
						let formattedName = await inaraData.userName.toLowerCase();
						await sql.wrapperInsert(`INSERT OR IGNORE INTO lookup (name,status) VALUES ("${formattedName}",0);`);
						let rawStatus = await sql.wrapperSelect(`SELECT status FROM lookup WHERE name = "${formattedName}"`);
						let parsedStatus = await this.getStatus(await rawStatus[0].status);
						const message = new EmbedBuilder()
							.setColor('#eb9c34')
							.setTitle(`CMDR Partial Match Found`)
							.setDescription(`Search Limpet found "${cmdrName}" as:\n[${inaraData.userName}](${inaraData.inaraURL})`)
							.addFields(
								{ name: `CMDRs with similar handles found: `, value: `${inaraData.otherNamesFound}` },
								{ name: `Palcon Internal Status:`, value: `${parsedStatus}` },
								{ name: `source: `, value: `[inara](https://inara.cz/)` }
							)
						await sql.wrapperInsert(`INSERT OR IGNORE INTO lookup (name,status) VALUES ("${formattedName}",0);`);
						return message;
					}
				} else if (await inaraStatus == 200) { //handle when match is returned
					let formattedName = await inaraData.userName.toLowerCase();
					await sql.wrapperInsert(`INSERT OR IGNORE INTO lookup (name,status) VALUES ("${formattedName}",0);`);
					let rawStatus = await sql.wrapperSelect(`SELECT status FROM lookup WHERE name = "${formattedName}"`);
					let parsedStatus = await this.getStatus(await rawStatus[0].status);
					if (inaraData.hasOwnProperty('commanderSquadron')) {
						const message = new EmbedBuilder()
							.setColor('#34ebb4')
							.setTitle(`CMDR Located`)
							.setThumbnail(`${inaraData.avatarImageURL}`)
							.setDescription(`[${inaraData.userName}](${inaraData.inaraURL})`)
							.addFields(
								{ name: `${inaraData.commanderSquadron.squadronMemberRank}`, value: `[${inaraData.commanderSquadron.squadronName}](${inaraData.commanderSquadron.inaraURL})` },
								{ name: `Palcon Internal Status:`, value: `${parsedStatus}` },
								{ name: `source: `, value: `[inara](https://inara.cz/)` }
							)
						return message;
					} else {
						const message = new EmbedBuilder()
							.setColor('#34ebb4')
							.setTitle(`CMDR Located`)
							.setThumbnail(`${inaraData.avatarImageURL}`)
							.setDescription(`[${inaraData.userName}](${inaraData.inaraURL})`)
							.addFields(
								{ name: `Palcon Internal Status:`, value: `${parsedStatus}` },
								{ name: `source: `, value: `[inara](https://inara.cz/)` }
							)
						return message;
					}
				}
			} else { //handle any other error from inara
				console.log(`${date} inara error: ${await data.events[0].eventStatus}`);
			}
		}
		catch (error) { //handle any other general errors
			console.log(`${date} general error - code: ${await error}`);
		}
	}

}

module.exports = new inara;