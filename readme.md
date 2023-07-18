# CMDR Search Limpet v2 - By Sam "Fixxxer" White (ED handle; CMDR SuperFixxxeR)

## Introduction
This is a relaunch of an earlier project called CMDRSearchLimpet (`https://github.com/SuperWhiteNoise/cmdrSearchLimpet`) - called CMDRSearchLimpetV2

I took what I learned from that original project and decided to re-write it, and added some extras too.

This code allows you to have a Discord bot lookup CMDR names for the game Elite Dangerous on INARA.

## Special thanks to
Palcon
Dan De Lion (Palcon) - hosting

## Colours
`#eb3449` - red / something wrong
`#34ebb4` - green / help
`#eb9c34` - orange / partial
`#0388fc` - blue / sql

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

### Ideas / the future
- roasts system
- quick credit / bounty tracker (self managed)

### Testing - Test notes
#### Command - Expected Result:
h - shows help													- PASS
j - tells a joke												- PASS
w name - correctly looks up inara								- PASS
w name - correctly looks up inara links to internal db			- PASS
w - blank look up attempt										- PASS
w invalid name - bad lookup attempt								- PASS
w partially matched name - partial lookup attempt				- PASS
w partially matched name - links to internal db					- PASS
s name - correctly looks up internal db							- PASS
s - blank look up attempt										- PASS
s invalid name - bad lookup attempt								- PASS
fr name - sets friend											- PASS
fr - blank request												- PASS
foe name - sets foe												- PASS
foe - blank request												- PASS
kos name - sets kos												- PASS
kos - blank request												- PASS
un name - sets unknown											- PASS
un - blank request												- PASS
^ test changing a name from one state to another etc

### What I don't know
- How long the database lasts (I presume forever, as it's a physical file)
- How big the database can get, and what performance issues may arise from larger database lookups
- If this (namely, sqlite wrapper and sqlite3) will run on Windows (probably, yes)