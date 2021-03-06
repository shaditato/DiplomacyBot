const Engine = require('../../engine.js');
const { dUnit, dPosition, dSubProvince, dProvince, dCountry, dOrder, dTurn, dGame } = Engine.classes;
const { unitTypes, orderTypes, provinceTypes, turnPhases } = Engine;

const rootPath = 'maps/standard/';
const provincePath = `${rootPath}provinces/`;
const unitPath = `${rootPath}units/`;

// === SUBPROVINCES ===

// turkey 
let ankInland = new dSubProvince('Ank', null);
let ankCoast = new dSubProvince('Ank', new dUnit(unitTypes.fleet, `${unitPath}Turkey1.png`));
let conInland = new dSubProvince('Con', new dUnit(unitTypes.army, `${unitPath}Turkey0.png`));
let conCoast = new dSubProvince('Con', null);
let smyInland = new dSubProvince('Smy', new dUnit(unitTypes.army, `${unitPath}Turkey0.png`));
let smyCoast = new dSubProvince('Smy', null);
let syrInland = new dSubProvince('Syr', null);
let syrCoast = new dSubProvince('Syr', null);
let armInland = new dSubProvince('Arm', null);
let armCoast = new dSubProvince('Arm', null);
// russia
let sevInland = new dSubProvince('Sev', null);
let sevCoast = new dSubProvince('Sev', new dUnit(unitTypes.fleet, `${unitPath}Russia1.png`));
let mosInland = new dSubProvince('Mos', new dUnit(unitTypes.army, `${unitPath}Russia0.png`));
let warInland = new dSubProvince('War', new dUnit(unitTypes.army, `${unitPath}Russia0.png`));
let stpInland = new dSubProvince('StP', null);
let stpNc = new dSubProvince('StP', null);
let stpSc = new dSubProvince('StP', new dUnit(unitTypes.fleet, `${unitPath}Russia1.png`));
let ukrInland = new dSubProvince('Ukr', null);
let lvnInland = new dSubProvince('Lvn', null);
let lvnCoast = new dSubProvince('Lvn', null);
let finInland = new dSubProvince('Fin', null);
let finCoast = new dSubProvince('Fin', null);

// = not done
ankInland.setAdjacent([conInland, smyInland, armInland]); 
ankCoast.setAdjacent([conCoast, armCoast]); //
conInland.setAdjacent([ankInland, smyInland]); //
conCoast.setAdjacent([ankCoast, smyCoast]); //
smyInland.setAdjacent([ankInland, conInland, armInland, syrInland]);
smyCoast.setAdjacent([conCoast, syrCoast]); //
syrInland.setAdjacent([smyInland, armInland]);
syrCoast.setAdjacent([smyCoast]); //
armInland.setAdjacent([ankInland, smyInland, sevInland]);
armCoast.setAdjacent([ankCoast, sevCoast]); //

sevInland.setAdjacent([armInland, ukrInland, mosInland]); //
sevCoast.setAdjacent([armCoast]) //
mosInland.setAdjacent([lvnInland, warInland, ukrInland, mosInland]);
warInland.setAdjacent([lvnInland, ukrInland, mosInland]); //
stpInland.setAdjacent([lvnInland, mosInland]); //
stpNc.setAdjacent([]); //
stpSc.setAdjacent([lvnCoast, finCoast]) //
ukrInland.setAdjacent([sevInland, warInland, mosInland]); //
lvnInland.setAdjacent([warInland, mosInland, stpInland]); //
lvnCoast.setAdjacent([stpSc]); //
finInland.setAdjacent([stpInland]); //
finCoast.setAdjacent([stpSc]); //

const subProvinces = { 
    "Ank": [ankInland, ankCoast], 
    "Con": [conInland, conCoast], 
    "Smy": [smyInland, smyCoast], 
    "Syr": [syrInland, syrCoast],
    "Arm": [armInland, armCoast],

    "Sev": [sevInland, sevCoast],
    "Mos": [mosInland],
    "War": [warInland],
    "StP": [stpInland, stpNc, stpSc],
    "Ukr": [ukrInland],
    "Lvn": [lvnInland, lvnCoast],
    "Fin": [finInland, finCoast]
}

// === PROVINCES === 

let Ank = new dProvince(['Ank', 'Ankara'], provinceTypes.coastal, true, subProvinces["Ank"], `${provincePath}Ank.png`, new dPosition(704, 598), new dPosition(727, 616), true);
let Con = new dProvince(['Con', 'Constantinople'], provinceTypes.coastal, true, subProvinces["Con"], `${provincePath}Cons.png`, new dPosition(629, 615), new dPosition(650, 630), true);
let Smy = new dProvince(['Smy', 'Smyrna'], provinceTypes.coastal, true, subProvinces["Smy"], `${provincePath}Smy.png`, new dPosition(635, 631), new dPosition(690, 690), true);
let Syr = new dProvince(['Syr', 'Syria'], provinceTypes.coastal, false, subProvinces["Syr"], `${provincePath}Syr.png`, new dPosition(792, 660), new dPosition(836, 696), false);
let Arm = new dProvince(['Arm', 'Armenia'], provinceTypes.coastal, false, subProvinces["Arm"], `${provincePath}Arm.png`, new dPosition(832, 587), new dPosition(864, 635), false);
let Sev = new dProvince(['Sev', 'Sevastopol'], provinceTypes.coastal, true, subProvinces["Sev"], `${provincePath}Sev.png`, new dPosition(649, 371), new dPosition(850, 500), true);
let Mos = new dProvince(['Mos', 'Moscow'], provinceTypes.inland, true, subProvinces["Mos"], `${provincePath}Mos.png`, new dPosition(590, 176), new dPosition(690, 340), true);
let War = new dProvince(['War', 'Warsaw'], provinceTypes.inland, true, subProvinces["War"], `${provincePath}War.png`, new dPosition(505, 377), new dPosition(550, 420), true);
let StP = new dProvince(['StP', 'St. Petersburg'], provinceTypes.coastal, true, subProvinces["StP"], `${provincePath}StP.png`, new dPosition(575, 1), new dPosition(680, 220), true);
let Ukr = new dProvince(['Ukr', 'Ukraine'], provinceTypes.inland, false, subProvinces["Ukr"], `${provincePath}Ukr.png`, new dPosition(595, 396), new dPosition(650, 450), false);
let Lvn = new dProvince(['Lvn', 'Livonia'], provinceTypes.coastal, false, subProvinces["Lvn"], `${provincePath}Lvn.png`, new dPosition(545, 264), new dPosition(600, 330), false);
let Fin = new dProvince(['Fin', 'Finland'], provinceTypes.coastal, false, subProvinces["Fin"], `${provincePath}Fin.png`, new dPosition(538, 47), new dPosition(600, 180), false);

const provinces = {
    "Turkey": [Ank, Con, Smy, Arm, Syr],
    "Russia": [Sev, Mos, War, StP, Ukr, Lvn, Fin],
    // "Other": [Syr, Arm, Ukr, Lvn, Fin]
}

let getUnits = function(provinces: typeof dProvince[]) {
    let collected = [];
    for (var i = 0; i < provinces.length; i++) {
        collected.push(provinces[i].getUnit());
    }
    return collected;
}

let Turkey = new dCountry('Turkey', provinces["Turkey"], getUnits(provinces["Turkey"]), '#FFDA7F');
let Russia = new dCountry('Russia', provinces["Russia"], getUnits(provinces["Russia"]), '#E4E4E4');

const countries = [Turkey, Russia]

const allProvinces = () => {
    let collected = [];
    let provincesArray = Object.values(provinces);
    for (var i = 0; i < provincesArray.length; i++) {
        collected = collected.concat(provincesArray[i]);
    }
    return collected;
}

let Game1 = new dGame(getUnits(allProvinces()), allProvinces(), countries, ['Spring', 'Fall'], Object.values(turnPhases), new dPosition(915, 767));

module.exports.Game1 = Game1;