# CMDR Search Limpet v2 - By Sam "Fixxxer" White (ED handle; CMDR SuperFixxxeR)

## Introduction
This is a relaunch of an earlier project called CMDRSearchLimpet (`https://github.com/SuperWhiteNoise/cmdrSearchLimpet`) - called CMDRSearchLimpetV2

I took what I learned from that original project and decided to re-write it, and added some extras too.

This code allows you to have a Discord bot lookup CMDR names for the game Elite Dangerous on INARA.

## Running the bot
- Clone this repo
- Create a `config.json` containing the following;
```
{
    "token": "???", //Your super secret token for your discord bot
    "prefix": "!", //Recommend don't change, but the prefix can be whatever you want. Its usually ! or . - eg !command.
    "appName": "your app name", //The app name given to Artie at INARA for the API access
    "commanderName": "CMDR Saltmine", //Your INARA commander name
    "inaraURL": "https://www.url.com", //INARAs API URL
    "inaraAPIkey": "???" //Your generic API key provided by INARA
}
```
- Windows; You can use `pm2` by running `pm2 start src/index.js`
- Mac/Windows you can also run the bot using `nodemon`

## Special thanks to
Palcon
Dan De Lion (Palcon) - hosting

## Colours
- `#eb3449` - red / something wrong
- `#34ebb4` - green / help
- `#eb9c34` - orange / partial
- `#0388fc` - blue / sql

### Resources
https://inara.cz/inara-api/
https://www.youtube.com/watch?v=ZRYn6tgnEgM - sqlite

## CHANGELOG - since previous version of CMDRSearchLimpet
### General updates
- IMPORTANT! Discord 'intents' added to the bot
- Updated all npm dependencies and removed any npm dependencies no longer required
- Abstracted functions to keep main entry point as clean as possible
- Improved / simplified logging
- Improved help command - !h
- Added limpet 'comebacks' as per v1, with some additions

### New Features
- Avatars. See INARA section for details.
- Added jokes - `!j` (content pulled from 3rd party, not responsible for bad jokes)
- SQLite database with a friend/foe/kos system. See SQLite section for details.

### INARA section
- Removed JS switch case method. Method now is to assume any status code starting with `2*` is processed
- This whole area of code now uses `if` and `if else` to make decisions
- Better parsing of INARA response so that commanders found with or without squadrons are reported better than they were in v1
- Now pull in the INARA avatar!

### SQLite
A new feature in cmdrSearchLimpetv2 is a mini database to allow users to track friends and foes, and mark kos orders.
How it works;
- When a user performs a search for a cmdr through cmdrSearchLimpetv2
	- when response is direct or partial match (code `200` / `202`)
	- check that cmdr name does not exist in cmdrSearchLimpetv2 mini-database
	- if not then store the cmdr name and default to status unknown (code `0`)
- Users can then update the record using the following commands;
  - `!fr <cmdr>` - regard as friend
  - `!foe <cmdr>` - regard as foe
  - `!kos <cmdr>` - Kill on sight
  - `!un <cmdr>` - the default value for any cmdr found by Inara
- Improved security features - where a user has the role of 'Paladin' they are able to update internal SQL records, users without this role are denied request
- Added new fields to the lookup internal table so we know when a record was updated and by whom
