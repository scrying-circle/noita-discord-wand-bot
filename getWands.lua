local nxml = dofile("nxml.lua")
local params = {...}
local f = assert(io.open(params[1], "r"))
local content = f:read("*all")
f:close()
local player = nxml.parse(content)
for element in player:each_child() do
    if element.attr.name == "inventory_quick" then
        for item in element:each_child() do
            if item.attr.tags == nil then
                item.attr.tags = ""
            end
            if string.find(item.attr.tags, "wand") and string.find(item.attr.tags, "item") and string.find(item.attr.tags, "teleportable_NOT") then
                local wand = {
                    ["tier"] = 0,
                    ["sprite"] = "",
                    ["shuffle"] = false,
                    ["sc"] = 1,
                    ["delay"] = 0,
                    ["recharge"] = 0,
                    ["max"] = 0,
                    ["charge"] = 0,
                    ["cap"] = 1,
                    ["spread"] = 0,
                    ["spells"] = {}
                }
                for property in item:each_child() do
                    if property.name == "AbilityComponent" then
                        wand["tier"] = tonumber(property.attr.gun_level)
                        wand["max"] = tonumber(property.attr.mana_max)
                        wand["charge"] = tonumber(property.attr.mana_charge_speed)
                        wand["sprite"] = property.attr.sprite_file
                        for gun_config in property:each_child() do
                            if gun_config.name == "gun_config" then
                                wand["cap"] = tonumber(gun_config.attr.deck_capacity)
                                wand["recharge"] = tonumber(gun_config.attr.reload_time) / 60
                                wand["sc"] = tonumber(gun_config.attr.actions_per_round)
                                wand["shuffle"] = gun_config.attr.shuffle_deck_when_empty
                            elseif gun_config.name == "gunaction_config" then
                                wand["spread"] = tonumber(gun_config.attr.spread_degrees)
                                wand["delay"] = tonumber(gun_config.attr.fire_rate_wait) / 60
                            end
                        end
                    elseif property.name == "Entity" and string.find(property.attr.tags, "card_action") then
                        local spell = property:first_of("ItemActionComponent")
                        table.insert(wand["spells"], spell.attr.action_id)
                    end
                end
                print(wand["tier"] .. " " .. wand["sprite"] .. " " .. wand["shuffle"] .. " " .. wand["sc"] .. " " .. wand["delay"] .. " " .. wand["recharge"] .. " " .. wand["max"] .. " " .. wand["charge"] .. " " .. wand["cap"] .. " " .. wand["spread"] .. " " .. table.concat(wand["spells"], " "))
            end
        end
    end
end