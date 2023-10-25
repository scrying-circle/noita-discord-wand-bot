import util from 'util';
import child_process from 'child_process'
const exec = util.promisify(child_process.exec);
import { writeFile, unlink} from 'fs/promises';
import { parseSpellList } from './parse.mjs';
export class Wand {
    constructor(tier, sprite, shuffle, sc, delay, recharge, max, charge, cap, spread, spells) {
        this.tier = parseInt(tier);
        this.sprite = sprite;
        this.shuffle = shuffle;
        this.spells_per_cast = parseInt(sc);
        this.cast_delay = Math.round(parseFloat(delay) * 100) / 100;
        this.recharge_time = Math.round(parseFloat(recharge) * 100) / 100;
        this.mana_max = parseInt(max);
        this.mana_charge = parseInt(charge);
        this.capacity = parseInt(cap);
        this.spread = parseFloat(spread);
        this.spells = spells;
    }
}
export const generateWand = function (params) {
    const data = params.split(" ");
    if (data.length < 11) {
        throw console.error("Not enough parameters!");
    }
    let spells;
    try {
        spells = parseSpellList(data.slice(10).join(" "));
    } catch {
        spells = ["EMPTY"]
    }
    const wand = new Wand(...data.slice(0, 10), spells);
    if (wand.spells.length == 0) {
        wand.spells = ["EMPTY"];
    }
    
    if (wand.sprite.includes("xml")) {
        wand.sprite = wand.sprite.slice(0, -3) + "png";
    }
    return wand
}
export const constructor = function(wand) {
    return Object.entries(wand).map(([key, value]) => value).join(" ");
}
export const wandCommand = function (message, wand_list) {
    const command = message.content.slice(6).split(' ');
    if (command[0] == "edit") {
        try {
            if (command[2] == "spells") {
                wand_list[command[1]][command[2]] = parseSpellList(command.slice(3).join(" "));
                return command[1];
            }
            wand_list[command[1]][command[2]] = command[3];
            return command[1];
        } catch {
            message.channel.send("Invalid command! `.wand edit <wand_id> <wand_field> <value>`");
        }
    } else if (command[0] == "set") {
        try {
            wand_list[command[1]] = wand_list[command[2]];
            return command[1];
        } catch {
            message.channel.send("Invalid command! `.wand set <wand_id> <wand_id>`");
        }
    } else if (command[0] == "create") {
        const newId = message.author.id + "_5";
        try {
            wand_list[newId] = generateWand(command.slice(1).join(" "));
            return newId;
        } catch {
            message.channel.send("Invalid command! `.wand create <tier> <sprite> <shuffle(0 or 1)> <spells_per_cast> <cast_delay> <recharge_time> <mana_max> <mana_charge> <capacity> <spread> <spells>`");
        }
    } else if (command[0] == "constructor") {
        try {
            message.channel.send(constructor(wand_list[command[1]]));
        } catch {
            message.channel.send("Invalid command! `.wand constructor <id>`");
        }
    } else {
        if (wand_list.keys().includes(command[0])) {
            return command[0];
        } else {
            message.channel.send("Command not recognised.");
        }
    }
}
export const wandUpload = async function (message) {
    const file = message.attachments.first();
    if (!file) {
        message.channel.send("File(generally `player.xml`) must be attached!");
        return;
    }
    if (file.contentType != "application/xml; charset=utf-8") {
        message.channel.send(`File must be an \`xml\` file! Received ${file.name}:${file.contentType}`);
        return;
    }
    const response = await fetch(file.url);
    const text = await response.text();
    await writeFile(file.name, text);
    const { stdout, stderr } = await exec(`lua getWands.lua "${file.name}"`);
    await unlink(file.name);
    console.error(stderr);
    let wand_list = {};
    const data = stdout.split("\n");
    for (let i = 0; i < data.length - 1; i++) {
        let wand;
        try {
            wand = generateWand(data[i]);
        } catch {
            continue;
        }
        wand_list[message.author.id + "_" + `${i}`] = wand;
    }
    return wand_list;
}
export const wandDownload = async function (message, wand_list) {
    const file = message.attachments.first();
    if (!file) {
        message.channel.send("File(generally player.xml) must be attached!");
        return;
    }
    if (file.contentType != "application/xml; charset=utf-8") {
        message.channel.send(`File must be an xml file! Received ${file.name}:${file.contentType}`);
        return;
    }
    let importing_wand = [];
    for (let [key, value] of Object.entries(wand_list)) {
        if (key.startsWith(message.author.id)) {
            importing_wand.push(value);
        }
    }
    const { stdout, stderr } = await exec(`lua setWands.lua "${file.name}" "${importing_wand.map(wand => constructor(wand)).join(" | ")}"`);
}