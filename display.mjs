import { createCanvas, loadImage } from 'canvas';
import { EmbedBuilder, AttachmentBuilder } from 'discord.js';
import imageSize from 'image-size';
import { spellList } from './globals.mjs';
export const drawSpellCanvas = async function (spells, capacity = spells.length) {
    const emptySlots = Array(capacity - spells.length).fill("EMPTY");
    spells = spells.concat(emptySlots);


    const spellTypes = {
        "ACTION_TYPE_PROJECTILE": "data/ui_gfx/inventory/item_bg_projectile.png",
        "ACTION_TYPE_MODIFIER": "data/ui_gfx/inventory/item_bg_modifier.png",
        "ACTION_TYPE_DRAW_MANY": "data/ui_gfx/inventory/item_bg_draw_many.png",
        "ACTION_TYPE_MATERIAL": "data/ui_gfx/inventory/item_bg_material.png",
        "ACTION_TYPE_STATIC_PROJECTILE": "data/ui_gfx/inventory/item_bg_static_projectile.png",
        "ACTION_TYPE_OTHER": "data/ui_gfx/inventory/item_bg_other.png",
        "ACTION_TYPE_PASSIVE": "data/ui_gfx/inventory/item_bg_passive.png",
        "ACTION_TYPE_UTILITY": "data/ui_gfx/inventory/item_bg_utility.png",
        "NONE": "data/ui_gfx/empty.png",
        "ANY": "data/ui_gfx/inventory/item_bg_any.png"
    }

    const scale = 3;
    const spells_per_row = 10;
    const spell_x = 20 * scale;
    const spell_y = 20 * scale;
    const spell_margin = 2 * scale;

    const canvas_width = Math.min(spell_x * spells.length, spell_y * spells_per_row);
    const canvas_height = Math.ceil(spells.length / spells_per_row) * spell_y;
    const canvas = createCanvas(canvas_width, canvas_height);
    const ctx = canvas.getContext('2d');


    ctx.fillStyle = '#000000';
    ctx.patternQuality = 'best';
    ctx.antialias = 'default';
    ctx.filter = 'default';
    ctx.imageSmoothingEnabled = false;
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < spells.length; i++) {
        let charges = -1;
        let x = (i % spells_per_row) * spell_x;
        let y = Math.floor(i / spells_per_row) * spell_y;

        await loadImage("data/ui_gfx/inventory/full_inventory_box.png").then(image => {
            ctx.drawImage(image, x, y, spell_x, spell_y);
        })
        let spellToDraw = spells[i];
        if (!isNaN(spellToDraw[0])) {
            charges = spellToDraw[0];
            spellToDraw = spellList[spellToDraw.slice(1)];
        } else {
            spellToDraw = spellList[spellToDraw];
        }
        const typeImage = spellTypes[spellToDraw.type];
        await loadImage(typeImage).then(image => {
            ctx.drawImage(image, x, y, spell_x, spell_y);
        });
        await loadImage(spellToDraw.sprite).then(image => {
            ctx.drawImage(image, x + spell_margin, y + spell_margin, spell_x - 2 * spell_margin, spell_y - 2 * spell_margin);
        });
        if (charges == 0) {
            await loadImage("nocharges.png").then(image => {
                ctx.drawImage(image, x + 15 * scale, y + scale, 4 * scale, 6 * scale);
            });
        } else if (charges == 1) {
            await loadImage("data/ui_gfx/inventory/icon_gun_permanent_actions.png").then(image => {
                ctx.drawImage(image, x + 14 * scale, y + scale, 6 * scale, 6 * scale);
            });
        }
    }
    return canvas;
}
export const drawSpellEmbed = function (canvas, spellNames) {
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'spells.png' });
    const embed = new EmbedBuilder()
        .setTitle('Spells')
        .setDescription(`${spellNames.join(", ")}`)
        .setImage('attachment://spells.png');
    return { embeds: [embed], files: [attachment] };
}
export const enlargeImage = async function (imagePath, scale) {
    const dimension = imageSize(imagePath);
    const canvas = createCanvas(dimension.width * scale, dimension.height * scale);
    const ctx = canvas.getContext('2d');
    await loadImage(imagePath).then(image => {
        ctx.drawImage(image, 0, 0, dimension.width * scale, dimension.height * scale);
    })
    return canvas;
}
export const drawWand = async function (wand, id) {
    const embed = new EmbedBuilder()
    const image = await enlargeImage(wand.sprite, 5);
    const sprite = new AttachmentBuilder(image.toBuffer(), { name: 'wand.png' }) || new AttachmentBuilder("data/ui_gfx/empty.png", { name: 'wand.png' });
    const spell_canvas = await drawSpellCanvas(wand.spells, wand.capacity);
    const spell_attachment = new AttachmentBuilder(spell_canvas.toBuffer(), { name: 'spells.png' });
    embed.setTitle(`ID: ${id}`);
    embed.addFields([
        { name: 'Tier', value: `${wand.tier}`, inline: true },
        { name: 'Shuffle', value: wand.shuffle == "1" ? "No" : "Yes", inline: true },
        { name: 'Spells/Cast', value: `${wand.spells_per_cast}`, inline: true },
        { name: 'Cast delay', value: `${wand.cast_delay}`, inline: true },
        { name: 'Recharge Time', value: `${wand.recharge_time}`, inline: true },
        { name: 'Capacity', value: `${wand.capacity}`, inline: true },
        { name: 'Mana max', value: `${wand.mana_max}`, inline: true },
        { name: 'Mana Charge Speed', value: `${wand.mana_charge}`, inline: true },
        { name: 'Spread', value: `${wand.spread}`, inline: true },
        { name: 'Spells', value: wand.spells.join(" "), inline: true }
    ])
    embed.setThumbnail('attachment://wand.png');
    embed.setImage('attachment://spells.png');
    return { embeds: [embed], files: [sprite, spell_attachment] };
}
export const drawWandList = function (wands) {
    return Object.entries(wands).map(async ([key, value]) => await drawWand(value, key));
}
