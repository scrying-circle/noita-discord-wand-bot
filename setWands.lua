local function mysplit(inputstr, sep)
    if sep == nil then
        sep = "%s"
    end
    local t = {}
    for str in string.gmatch(inputstr, "([^" .. sep .. "]+)") do
        table.insert(t, str)
    end
    return t
end

local params = mysplit({...}, " ")
local file = params[1]
table.remove(params, 1)
local wands = {}
local properties = {
    "tier",
    "sprite",
    "shuffle",
    "sc",
    "delay",
    "recharge",
    "max",
    "charge",
    "cap",
    "spread",
    "spells"
}
local pointer = 1
local wand = {
    ["spells"] = {}
}
for i, v in ipairs(params) do
    if properties[pointer] == "spells" and v ~= "|" then
        wand["spells"][#wand["spells"] + 1] = v
    elseif v ~= "|"  then
        wand[properties[pointer]] = v
        pointer = pointer + 1
    else
        pointer = 1
        table.insert(wands, wand)
        wand = {
            ["spells"] = {}
        }
    end
end
local nxml = dofile("nxml.lua")
local f = assert(io.open(file, "r"))
local content = f:read("*all")
f:close()
local player = nxml.parse(content)
local wand_count = 0
for element in player:each_child() do
    if element.attr.name == "inventory_quick" then
        for item in element:each_child() do
            if item.attr.tags == "teleportable_NOT,wand,item" then
                wand_count = wand_count + 1
                for property in item:each_child() do
                    if property.name == "AbilityComponent" then
                        property.attr.gun_level = wands[wand_count]["tier"]
                        property.attr.mana_max = wands[wand_count]["max"]
                        property.attr.mana_charge_speed = wands[wand_count]["charge"]
                        property.attr.sprite_file = wands[wand_count]["sprite"]
                        for gun_config in property:each_child() do
                            if gun_config.name == "gun_config" then
                                gun_config.attr.deck_capacity = wands[wand_count]["cap"]
                                gun_config.attr.reload_time = math.floor(tonumber(wands[wand_count]["recharge"]) * 60)
                                gun_config.attr.actions_per_round = wands[wand_count]["sc"]
                                gun_config.attr.shuffle_deck_when_empty = wands[wand_count]["shuffle"]
                            elseif gun_config.name == "gunaction_config" then
                                gun_config.attr.spread_degrees = wands[wand_count]["spread"]
                                gun_config.attr.fire_rate_wait = math.floor(tonumber(wands[wand_count]["delay"]) * 60)
                            end
                        end
                    elseif property.name == "Entity" and string.find(property.attr.tags, "card_action") then
                        local spell = property:first_of("ItemActionComponent")
                        table.insert(wand["spells"], spell.attr.action_id)
                    end
                end
                print(wand["tier"] ..
                " " ..
                wand["sprite"] ..
                " " ..
                wand["shuffle"] ..
                " " ..
                wand["sc"] ..
                " " ..
                wand["delay"] ..
                " " ..
                wand["recharge"] ..
                " " ..
                wand["max"] ..
                " " ..
                wand["charge"] .. " " .. wand["cap"] .. " " .. wand["spread"] .. " " .. table.concat(wand["spells"], " "))
            end
        end
    end
end
