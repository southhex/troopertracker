// equipment.js

export const MAX_AMMO = 3; 

// --- EQUIPMENT DATABASE ---
// This is your lookup table for all equipment and their custom counters.
export const EQUIPMENT_DATABASE = {
    //Armor  
    'light_armor': {
        name: "Light Armor",
        description: "Roll twice when Moving, pick the best result",
        cost: 0,
        type: 'basic_armor'
    },
    'medium_armor': { 
        name: "Medium Armor", 
        description: "Ignore first Injury taken during Mission.", 
        cost: 0,
        type: 'basic_armor',
        counters: { 
            // The key here becomes the property name on the Trooper object (plus '_current')
            armor_absorbed: { 
                name: "Armor", 
                max: 1, 
                icon: "shield"
            } 
        }
    },
    'heavy_armor' :{
        name: "Heavy Armor",
        description: "Reduces Injury range by 1.",
        cost: 0,
        type: 'basic_armor'
    },
    //Weapons
    'assault_rifle' :{
        name: "Assault Rifle",
        description: "1-in-6 chance of not consuming Ammo when enhancing an attack.",
        cost: 0,
        type: 'basic_weapon'
    },
    'carbine':{
        name: "Carbine",
        description: "+1d6 to Offense Roll when Engaged in Tight battlefields.",
        cost: 0,
        type: 'basic_weapon'
    },
    'marksman_rifle':{
        name: "Marksman Rifle",
        description: "+1d6 to Offense Roll when Limited in Transitional or Open battlefields.",
        cost: 0,
        type: 'basic_weapon'
    },
    //Special Weapons
    'lmg':{
        name: "LMG",
        description: "Passive: An additional +1d6 for the Defense Roll of a Trooper receiving Covering Fire",
        cost: 1,
        type: 'special_weapon'
    },
    'sniper_rifle':{
        name:"Sniper Rifle",
        description: "Passive: +1d6 to the Offense Roll when Fortified. An additional +1d6 when Fortified and didn't Move in the previous Exchange.",
        cost: 0,
        type: 'special_weapon'
    },
    'grenade_launcher':{
        name:"Grenade Launcher",
        description: "Active: Launch a grenade against a Hard Target (counts as a Hit), or at another Trooper's target, granting them the benefit of Flanking in the next Offense Roll. Multiple grenades can be fired in one attack - each costing 1 Ammo.",
        cost: 1,
        type: 'special_weapon'
    },
    'hmg':{
        name:"HMG",
        description:"Passive: +1d6 on Offensive Roll when Fortified. Active: Provide Covering Fire for up to 3 Troopers this round. Costs 1 Ammo regardless of number of Troopers covered.",
        cost: 2,
        type: 'special_weapon'
    },
    'rocket_launcher':{
        name:"Rocket Launcher",
        description:"Active: Add +3d6 to Offensive Roll - or deal direct damage to a Hard Target, counting as 2 Hits. Trooper is in Exposed position after use. Single use.",
        cost:1,
        type: 'special_weapon',
        counters:{
            rocket:{
                name:"R. Launcher",
                max: 1,
                icon: "diamond"
            }
        }
    },
    'melee_weapon':{
        name: "Melee Weapon",
        description: "Passive: When a Trooper Moves Up to a Flanking position, they can choose to move to a Flanked position instead of rolling. Doing so adds +3d6 to the Offense Roll. This already includes a bonus for Flanking",
        cost:0,
        type: 'special_weapon'
    },
    'plasma_rifle':{
        name:"Plasma Rifle",
        description:"Active: Roll 1d6 on use. See table. Does not require Ammo.",
        cost: 3,
        type: 'special_weapon'
    },
    //Special Equipment
    'supply_pack': { 
        name: "Supply Pack", 
        description: "Holds 6 extra Ammo, which can be redistributed after combat.",
        cost: 1,
        type: 'special_equipment',
        counters: { 
            pack_ammo: { 
                name: "Pack Ammo", 
                max: 6, 
                icon: "circle",
                color: "navy"
            } 
        }
    },
    'commanders_kit':{
        name:"Commander's Kit",
        description:"Whenever Enemy Tactics are triggered, roll 1d6. On a 1-3, the Tactic is nullified as the Commander adapts the squad's response in time",
        cost:1,
        type: 'special_equipment'
    },
    'demo_charges':{
        name: "Demolition Charges",
        description:"Placing charges can be done once a Sector is cleared, or during an Engagement. If done during an Engagement, Momentum must be 1 or greater. The Trooper must commit 2 Exchanges to placing the charges: 1 to move towards a suitable point to place them (acts as Moving Up), 1 to set the charges."
    },
    'drone_gear':{
        name:"Drone Gear",
        description:"Once per mission, add +1 to the next Advance Roll.",
        cost:0,
        type: 'special_equipment',
        counters:{
            drone:{
                name: "Drone",
                max:1,
                icon: "drone",
                color:"orange"
            }
        }
    },
    'jump_pack':{
        name:"Jump Pack",
        description:"Once per Engagement, the Trooper can use their Move to instantly shift to a Offensive/Defensive position of choice.",
        cost:2,
        type: 'special_equipment',
        counters:{
            jump:{
                name:"Jump",
                max:1,
                icon: "rocket"
            }
        }
    },
    'medic_gear':{
        name:"Medic Gear",
        description:"Allows the user to patch up Wounded Troopers back to Grazed when out of combat. It costs 1 Ammo to restore a Trooper to Grazed, the 'ammo' representing the medical supplies brought by the Trooper.",
        cost:1,
        type: 'special_equipment'
    },
    'radio_gear':{
        name:"Radio Gear",
        description:"Call in an artillery strike on the current Sector, once per Mission. Hits in 1d2 Exchanges from now. When it hits, gain +2 Momentum instantly, with all ground-based Hard Targets being destroyed. All Troopers must make a Defense Roll as if Flanked; gaining 1d3 Injury on failure.",
        cost:1,
        type: 'special_equipment',
        counters:{
            strike:{
                name:"Art. Strike",
                max:1,
                icon: "arrow-big-down-dash",
                color: "red"

            }
        }
    }
};