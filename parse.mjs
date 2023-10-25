import { spellList, spellNames } from './globals.mjs';
export const parseSpellList = function (content) {
    function addMultiplier(rewrite, i, multiplier) {
        if (i == 0) {
            return;
        }
        const amount = parseInt(multiplier) - 1;
        if (isNaN(amount)) {
            return;
        }
        for (let j = 0; j < amount; j++) {
            addSpell(rewrite, rewrite, rewrite.length - 1);
        }
    }
    function addSpell(read, write, i) {
        let spell = read[i];
        let charges = "";
        if (!isNaN(spell[0])) {
            charges = spell[0];
            spell = spell.slice(1);
        }
        if (spell[0] == "X") {
            addMultiplier(write, i, spell.slice(1));
        } else if (spell in spellNames) {
            write.push(charges + spellNames[spell]);
        } else if (spell in spellList) {
            write.push(charges + spell);
        } else {
            return ["EMPTY"]
        }
    }
    const params = content.toUpperCase().split(' ');
    let spells = [];
    for (let i = 0; i < params.length; i++) {
        addSpell(params, spells, i);
    }
    return spells;
}