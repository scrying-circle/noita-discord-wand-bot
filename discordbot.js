import { Client, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const display = require('./display.js');
const parse = require('./parse.js');

const get_spell_list = parse.getSpellList("data/gun_actions.lua");
let spell_list = {};
get_spell_list.then(data => {
	spell_list = data;
});
const spell_names = {
	"???": "FUNKY_SPELL",
	"ACIDBALL": "ACIDSHOT",
	"BH": "BLACK_HOLE",
	"BH^": "BLACK_HOLE_DEATH_TRIGGER",
	"BOMBCART": "BOMB_CART",
	"BUBBLE": "BUBBLESHOT",
	"BUBBLE*": "BUBBLESHOT_TRIGGER",
	"AIR": "AIR_BULLET",
	"CHAINBOLT": "CHAIN_BOLT",
	"CSPHERE": "CURSED_ORB",
	"DCROSS": "DEATH_CROSS",
	"GDCROSS": "DEATH_CROSS_BIG",
	"PCROSS": "LASER_EMITTER_FOUR",
	"DBLAST": "POWERDIGGER",
	"DBOLT": "DIGGER",
	"DCRYSTAL": "PIPE_BOME",
	"DCRYSTAL*" : "PIPE_BOMB_DEATH_TRIGGER",
	"DROPPER": "GRENADE_LARGE",
	"TNT": "DYNAMITE",
	"EQ": "CRUMBLING_EARTH",
	"EPORTAL": "TENTACLE_PORTAL",
	"EORB": "SLOW_BULLET",
	"EORB*": "SLOW_BULLET_TRIGGER",
	"EXSPHERE": "EXPANDING_ORB",
	"FBOLT": "GRENADE",
	"FBOLT*": "GRENADE_TRIGGER",
	"LFBOLT": "GRENADE_TIER_2",
	"GFBOLT": "GRENADE_TIER_3",
	"OFBOLT": "GRENADE_ANTI",
	"FBOMB": "FIREBOMB",
	"FWORK": "FIREWORK",
	"FTHROW": "FLAMETHROWER",
	"GLITTER": "GLITTER_BOMB",
	"GLUE": "GLUE_SHOT",
	"HBOLT": "HEAL_BULLET",
	"HLANCE": "LANCE_HOLY",
	"HBOMB": "BOMB_HOLY",
	"GHBOMB": "BOMB_HOLY_GIGA",
	"IBALL": "ICEBALL",
	"CONCL": "LASER",
	"LB": "LIGHTNING",
	"TC": "THUNDERBALL",
	"BLIGHT": "BALL_LIGHTNING",
	"LUMI": "LUMINOUS_DRILL",
	"LUMI^": "LASER_LUMINOUS_DRILL",
	"MARROW": "BULLET",
	"MARROW*": "BULLET_TRIGGER",
	"MARROW^": "BULLET_TIMER",
	"MBOLT": "HEAVY_BULLET",
	"MGUARD": "MAGIC_SHIELD",
	"BMGUARD": "BIG_MAGIC_SHIELD",
	"MM": "ROCKET",
	"LMM": "ROCKET_TIER_2",
	"GMM": "ROCKET_TIER_3",
	"BMIST": "MIST_BLOOD",
	"AMIST": "MIST_ALCOHOL",
	"SMIST": "MIST_SLIME",
	"TMIST": "MIST_RADIOACTIVE",
	"DUCK": "EXPLODING_DUCKS",
	"GAZE": "FREEZING_GAZE",
	"ICL": "MEGALASER",
	"TRIPLICATE": "BUCKSHOT",
	"GNUKE": "NUKE_GIGA",
	"PODF": "DARKFLAME",
	"POL": "GLOWING_BOLT",
	"PBEAM": "LASER_EMITTER",
	"PCUTTER": "LASER_EMITTER_CUTTER",
	"SPOREPOD": "SPORE_POD",
	"PROPANE": "PROPANE_TANK",
	"RPS": "RANDOM_PROJECTILE",
	"ROCK": "SUMMON_ROCK",
	"DISC": "DISC_BULLET",
	"GDISC": "DISC_BULLET_BIG",
	"ODISC": "DISC_BULLET_BIGGER",
	"SPARK": "LIGHT_BULLET",
	"SPARK*": "LIGHT_BULLET_TRIGGER",
	"SPARK^": "LIGHT_BULLET_TIMER",
	"SPARK**": "LIGHT_BULLET_TRIGGER_2",
	"BB": "RUBBER_BALL",
	"ESPHERE": "BOUNCY_ORB",
	"ESPHERE^": "BOUNCY_ORB_TIMER",
	"SPIRALSHOT": "SPIRAL_SHOT",
	"SPITTER^": "SPITTER_TIMER",
	"LSPITTER^": "SPITTER_TIER_2_TIMER",
	"LSPITTER": "SPITTER_TIER_2",
	"GSPITTER^": "SPITTER_TIER_3_TIMER",
	"GSPITTER": "SPITTER_TIER_3",
	"DEER": "EXPLODING_DEER",
	"EGG": "SUMMON_EGG",
	"EBOX": "TNTBOX",
	"LEBOX": "TNTBOX_BIG",
	"HOLLOW": "SUMMON_HOLLOW_EGG",
	"SPIRIT": "PEBBLE",
	"TENTACLE^": "TENTACLE_TIMER",
	"HOMEBRINGER": "TELEPORT_PROJECTILE_CLOSER",
	"RETURN": "TELEPORT_PROJECTILE_STATIC",
	"SWAPPER": "SWAPPER_PROJECTILE",
	"TELE": "TELEPORT_PROJECTILE",
	"STELE": "TELEPORT_PROJECTILE_SHORT",
	"UCRYSTAL": "MINE",
	"UCRYSTAL*": "MINE_DEATH_TRIGGER",
	"WORM": "WORM_SHOT",
	"HBARR": "WALL_HORIZONTAL",
	"VBARR": "WALL_VERTICAL",
	"SBARR": "WALL_SQUARE",
	"COB": "LEVITATION_FIELD",
	"COD": "TELEPORTATION_FIELD",
	"COF": "BESERK_FIELD",
	"COSH": "SHIELD_FIELD",
	"COST": "FREEZE_FIELD",
	"COT": "ELECTROCUTION_FIELD",
	"COP": "POLYMORPH_FIELD",
	"COM": "CHAOS_POLYMORPH_FIELD",
	"COV": "REGENERATION_FIELD",
	"WRAIN": "CLOUD_WATER",
	"ORAIN": "CLOUD_OIL",
	"BRAIN": "CLOUD_BLOOD",
	"ARAIN": "CLOUD_ACID",
	"TCLOUD": "CLOUD_THUNDER",
	"ED": "PIPE_BOMB_DETONATION",
	"GLITTERFIELD": "PURPLE_EXPLOSION_FIELD",
	"MATO": "WORM_RAIN",
	"METEORS": "METEOR_RAIN",
	"FLY": "SWARM_FLY",
	"FIREBUG": "SWARM_FIREBUG",
	"WASP": "SWARM_WASP",
	"DS": "DELAYED_SPELL",
	"PROJGRAV": "PROJECTILE_GRAVITY_FIELD",
	"PROJTHUNDER": "PROJECTILE_THUNDER_FIELD",
	"PROJTRANS": "PROJECTILE_TRANSMUTATION_FIELD",
	"RSPS": "RANDOM_STATIC_PROJECTILE",
	"GBH": "BLACK_HOLE_BIG",
	"GWH": "WHITE_HOLE_BIG",
	"OBH": "BLACK_HOLE_GIGA",
	"EXPLO": "EXPLOSION",
	"BRIMSTONE": "FIRE_BLAST",
	"POISON": "POISON_BLAST",
	"SPIRITS": "ALCOHOL_BLAST",
	"THUNDER": "THUNDER_BLAST",
	"MEXPLO": "EXPLOSION_LIGHT",
	"FRIENDFLY": "FRIEND_FLY",
	"LIQVAC": "VACUUM_LIQUID",
	"POWDVAC": "VACUUM_POWDER",
	"VACFIELD": "VACUUM_ENTITIES",
	"ESHIELD": "ENERGY_SHIELD",
	"ESHIELDS": "ENERGY_SHIELD_SECTOR",
	"TINY": "TINY_GHOST",
	"ETORCH": "TORCH_ELECTRIC",
	"ASE": "X_RAY",
	"BM": "BLOOD_MAGIC",
	"INNER": "CASTER_CAST",
	"IPLIC": "I_SHOT",
	"YPLIC": "Y_SHOT",
	"TIPLIC": "T_SHOT",
	"WIPLIC": "W_SHOT",
	"QUPLIC": "QUAD_SHOT",
	"PEPLIC": "PENTA_SHOT",
	"HEPLIC": "HEXA_SHOT",
	"LDC": "LONG_DISTANCE_CAST",
	"TELECAST": "TELEPORT_CAST",
	"WARPCAST": "SUPER_TELEPORT_CAST",
	"STA": "ALL_ACID",
	"STBH": "ALL_BLACKHOLES",
	"STDC": "ALL_DEATHCROSSES",
	"STMM": "ALL_ROCKETS",
	"STN": "ALL_NUKES",
	"STGS": "ALL_DISCS",
	"TAIKA": "SUMMON_WANDGHOST",
	"PLAT": "TEMPORARY_PLATFORM",
	"WALL": "TEMPORARY_WALL",
	"BTP": "BLOOD_TO_POWER",
	"GTP": "MONEY_MAGIC",
	"TRAILL": "LARPA_CHAOS_2",
	"MANA": "MANA_REDUCE",
	"FARC": "ARC_FIRE",
	"GARC": "ARC_GUNPOWDER",
	"PARC": "ARC_POISON",
	"EARC": "ARC_ELECTRIC",
	"DOWNBOLT": "ROCKET_DOWNWARDS",
	"OCTOBOLT": "ROCKET_OCTAGON",
	"BUBBLEBOUNCE": "BOUNCE_SPARK",
	"LIGHTBOUNCE": "BOUNCE_LASER",
	"NO_BOUNCE": "REMOVE_BOUNCE",
	"CRACKLEBOUNCE": "BOUNCE_SMALL_EXPLOSION",
	"VACBOUNCE": "BOUNCE_HOLE",
	"BOOMBOUNCE": "BOUNCE_EXPLOSION",
	"LBOUNCE": "BOUNCE_LARPA",
	"LIGHTNINGBOUNCE": "BOUNCE_LIGHTNING",
	"PLASMABOUNCE": "BOUNCE_LASER_EMITTER",
	"CONCEXPL": "EXPLOSION_TINY",
	"BLOODCRIT": "HITFX_CRITICAL_BLOOD",
	"BURNCRIT": "HITFX_BURNING_CRITICAL_HIT",
	"OILCRIT": "HITFX_CRITICAL_OIL",
	"WATERCRIT": "HITFX_CRITICAL_WATER",
	"CRIT": "CRITICAL_HIT",
	"NULL": "ZERIO_DAMAGE",
	"HEAVY": "HEAVY_SHOT",
	"LIGHT": "LIGHT_SHOT",
	"EQSHOT": "CRUMBLING_EARTH_PROJECTILE",
	"ECHARGE": "ELECTRIC_CHARGE",
	"EXPLONDRUNK": "HITFX_EXPLOSION_ALCOHOL",
	"GEXPLONDRUNK": "HITFX_EXPLOSION_ALCOHOL_GIGA",
	"EXPLONSLIME": "HITFX_EXPLOSION_SLIME",
	"GEXPLONSLIME": "HITFX_EXPLOSION_SLIME_GIGA",
	"TOXICCHARM": "HITFX_TOXIC_CHARM",
	"RAINBOW": "COLOUR_RAINBOW",
	"INVIS": "COLOUR_INVIS",
	"RED": "COLOUR_RED",
	"GREEN": "COLOUR_GREEN",
	"BLUE": "COLOUR_BLUE",
	"YELLOW": "COLOUR_YELLOW",
	"ORANGE": "COLOUR_ORANGE",
	"PURPLE": "COLOUR_PURPLE",
	"SPREAD": "HEAVY_SPREAD",
	"KB": "KNOCKBACK",
	"CHAOSL": "LARPA_CHAOS",
	"DOWNL": "LARPA_DOWNWARDS",
	"EXPLOL": "LARPA_DEATH",
	"UPL": "LARPA_UPWARDS",
	"ORBITL": "ORBIT_LARPA",
	"CHAIN": "CHAIN_SHOT",
	"DOWNLIFE": "LIFETIME_DOWN",
	"UPLIFE": "LIFETIME",
	"FORBIT": "ORBIT_FIREBALLS",
	"NORBIT": "ORBIT_NUKES",
	"SORBIT": "ORBIT_DISCS",
	"PORBIT": "ORBIT_LASERS",
	"TORBIT": "TRUE_ORBIT",
	"HORIZ": "HORIZONTAL_ARC",
	"LINE": "LINE_ARC",
	"UP": "GRAVITY_ANTI",
	"DOWN": "GRAVITY",
	"FLYDOWN": "FLY_DOWNWARDS",
	"FLYUP": "FLY_UPWARDS",
	"ORBITARC": "ORBIT_SHOT",
	"PHASING": "PHASING_ARC",
	"PPP": "PINGPONG_PATH",
	"SPIRALARC": "SPIRALING_SHOT",
	"CHAOTICARC": "CHAOTIC_ARC",
	"SLITHERARC": "SINEWAVE",
	"AIMING": "HOMING_CURSOR",
	"ANTIHOME": "ANTI_HOMING",
	"BOOMERANG": "HOMING_SHOOTER",
	"ROTATE": "HOMING_ROTATE",
	"SHORTHOME": "HOMING_SHORT",
	"WANDHOME": "HOMING_WAND",
	"ACCELHOME": "HOMING_ACCELERATING",
	"PAT": "HOMING_AREA",
	"PERFTHROW": "FIREBALL_RAY_ENEMY",
	"PERGRAVF": "GRAVITY_FIELD_ENEMY",
	"PERTENT": "TENTACLE_RAY_ENEMY",
	"PERLTHROW": "LIGHTNING_RAY_ENEMY",
	"PETRIFY": "HITFX_PETRIFY",
	"PIERCING": "PIERCING_SHOT",
	"ENCHANCER": "LASER_EMITTER_WIDER",
	"QUANTUM": "QUANTUM_SPLIT",
	"CHAOSM": "RANDOM_EXPLOSION",
	"RMS": "RANDOM_MODIFIER_SPELL",
	"DAMPER": "RECOIL_DAMPER",
	"NOSPREAD": "SPREAD_REDUCE",
	"NOEXPLO": "EXPLOSION_REMOVE",
	"SLOWSTEADY": "SLOW_BUT_STEADY",
	"ACCEL": "ACCELERATING_SHOT",
	"DECEL": "DECELERATING_SHOT",
	"PROJSHIELD": "ENERGY_SHIELD_SHOT",
	"AVOIDARC": "AVOIDING_ARC",
	"DRILLING": "CLIPPING_SHOT",
	"FIRECRACKER": "UNSTABLE_GUNPOWDER",
	"FLOATARC": "FLOATING_ARC",
	"ME": "MATTER_EATER",
	"EP": "EXPLOSIVE_PROJECTILE",
	"FTHROW": "FIREBALL_RAY",
	"LTHROW": "LIGHTNING_RAY",
	"TTHROW": "TENTACLE_RAY",
	"FFTHROW": "FIREBALL_RAY_LINE",
	"PTHROW": "LASER_EMITTER_RAY",
	"ETP": "ESSENCE_TO_POWER",
	"STP": "SPELLS_TO_POWER",
	"ATRAIL": "ACID_TRAIL",
	"BTRAIL": "BURNING_TRAIL",
	"FTRAIL": "FIRE_TRAIL",
	"GTRAIL": "GUNPOWDER_TRAIL",
	"OTRAIL": "OIL_TRAIL",
	"PTRAIL": "POISON_TRAIL",
	"RTRAIL": "RAINBOW_TRAIL",
	"WTRAIL": "WATER_TRAIL",
	"BTA": "BLOOD_TO_ACID",
	"GTS": "STATIC_TO_SAND",
	"LTB": "LAVA_TO_BLOOD",
	"LIQDET": "LIQUID_TO_EXPLOSION",
	"TSTA": "TOXIC_TO_ACID",
	"WTP": "WATER_TO_POISON",
	"ELECWEAK": "CURSE_WITHER_ELECTRICITY",
	"EXPLOWEAK": "CURSE_WITHER_EXPLOSION",
	"MELWEAK": "CURSE_WITHER_MELEE",
	"PROJWEAK": "CURSE_WITHER_PROJECTILE",
	"CHUNK": "SOILBALL",
	"FCIRCLE": "CIRCLE_FIRE",
	"ACIRCLE": "CIRCLE_ACID",
	"OCIRCLE": "CIRCLE_OIL",
	"WCIRCLE": "CIRCLE_WATER",
	"ACID": "MATERIAL_ACID",
	"BLOOD": "MATERIAL_BLOOD",
	"CEMENT": "MATERIAL_CEMENT",
	"OIL": "MATERIAL_OIL",
	"WATER": "MATERIAL_WATER",
	"SEAL": "SEA_LAVA",
	"SEAAL": "SEA_ALCOHOL",
	"SEAO": "SEA_OIL",
	"SEAW": "SEA_WATER",
	"SEAA": "SEA_ACID",
	"SEAG": "SEA_ACID_GAS",
	"SEASW": "SEA_SWAMP",
	"TOB": "TOUCH_BLOOD",
	"TOG": "TOUCH_GOLD",
	"TOO": "TOUCH_OIL",
	"TOS": "TOUCH_SMOKE",
	"TOA": "TOUCH_ALCOHOL",
	"TOW": "TOUCH_WATER",
	"DOUBLE": "BURST_2",
	"TRIPLE": "BURST_3",
	"QUAD": "BURST_4",
	"OCTO": "BURST_8",
	"MYRIAD": "BURST_X",
	"DOUBLES": "SCATTER_2",
	"TRIPLES": "SCATTER_3",
	"QUADS": "SCATTER_4",
	"BEHIND": "I_SHAPE",
	"ABOVE": "T_SHAPE",
	"PENTAGON": "PENTAGRAM_SHAPE",
	"HEXAGON": "CIRCLE_SHAPE",
	"BIFURC": "Y_SHAPE",
	"TRIFURC": "W_SHAPE",
	"AT": "ADD_TRIGGER",
	"TRIGGER": "ADD_TRIGGER",
	"TIMER": "ADD_TIMER",
	"EXPIR": "ADD_DEATH_TRIGGER",
	"D2": "DIVIDE_2",
	"D3": "DIVIDE_3",
	"D4": "DIVIDE_4",
	"D10": "DIVIDE_10",
	"OCA": "OCARINA_A",
	"OCB": "OCARINA_B",
	"OCC": "OCARINA_C",
	"OCD": "OCARINA_D",
	"OCE": "OCARINA_E",
	"OCF": "OCARINA_F",
	"OCG": "OCARINA_GSHARP",
	"OCA2": "OCARINA_A2",
	"KANA": "KANTELE_A",
	"KAND": "KANTELE_D",
	"KANDS": "KANTELE_DIS",
	"KANE": "KANTELE_E",
	"KANG": "KANTELE_G",
	"RS": "RANDOM_SPELL",
	"CRS": "DRAW_RANDOM",
	"CRS3": "DRAW_RANDOM_X3",
	"C3RS": "DRAW_3_RANDOM",
	"REQPROJ": "IF_PROJECTILE",
	"REQHP": "IF_HP",
	"REQENEMY": "IF_ENEMY",
	"REQOTHER": "IF_HALF",
	"OTHERWISE": "IF_ELSE",
	"END": "IF_END",
	"PORTAL": "SUMMON_PORTAL",
	"EOE": "ALL_SPELLS",
	"2X": "DUPLICATE",
	"DFIELD": "AREA_DAMAGE",
	"BL": "BLOODLUST",
	"DPLUS": "DAMAGE",
	"MTD": "DAMAGE_FOREVER",
	"RD": "DAMAGE_RANDOM"
}

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', message => {

	if (message.author.bot) return;
	//message.channel.send("Recieved!")

	if (message.content.startsWith('.display')) {
		let spells = parse.displayArguments(message, spell_list, spell_names);
		display.send(message, spells, spell_list);
	} else if (message.content.startsWith('.test')) {
		message.channel.send("https://github.com/scrying-circle/wandmaster/blob/main/discordbot.js");
	}
})
client.login('');
