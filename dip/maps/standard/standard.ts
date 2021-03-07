// const Engine = require('../../engine.js');
import { Engine } from '../../engine';
const { unitTypes, orderTypes, provinceTypes, turnPhases } = Engine;
const { Unit, SubProvince, Position, Province, Country, Game } = Engine;
// const { unitTypes, orderTypes, provinceTypes, turnPhases } = Engine;

const rootPath = './dip/maps/standard/';
const provincePath = `${rootPath}provinces/`;
const unitPath = `${rootPath}units/`;

// === SUBPROVINCES ===

// turkey 
let ankInland = new SubProvince('Ank', null);
let ankCoast = new SubProvince('Ank', new Unit(unitTypes.fleet, `${unitPath}Turkey1.png`));
let conInland = new SubProvince('Con', new Unit(unitTypes.army, `${unitPath}Turkey0.png`));
let conCoast = new SubProvince('Con', null);
let smyInland = new SubProvince('Smy', new Unit(unitTypes.army, `${unitPath}Turkey0.png`));
let smyCoast = new SubProvince('Smy', null);
let syrInland = new SubProvince('Syr', null);
let syrCoast = new SubProvince('Syr', null);
let armInland = new SubProvince('Arm', null);
let armCoast = new SubProvince('Arm', null);
// russia
let sevInland = new SubProvince('Sev', null);
let sevCoast = new SubProvince('Sev', new Unit(unitTypes.fleet, `${unitPath}Russia1.png`));
let mosInland = new SubProvince('Mos', new Unit(unitTypes.army, `${unitPath}Russia0.png`));
let warInland = new SubProvince('War', new Unit(unitTypes.army, `${unitPath}Russia0.png`));
let stpInland = new SubProvince('StP', null);
let stpNc = new SubProvince('StP', null);
let stpSc = new SubProvince('StP', new Unit(unitTypes.fleet, `${unitPath}Russia1.png`));
let ukrInland = new SubProvince('Ukr', null);
let lvnInland = new SubProvince('Lvn', null);
let lvnCoast = new SubProvince('Lvn', null);
let finInland = new SubProvince('Fin', null);
let finCoast = new SubProvince('Fin', null);

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

let Ank = new Province(['Ank', 'Ankara'], provinceTypes.coastal, true, subProvinces["Ank"], `${provincePath}Ank.png`, new Position(704, 598), new Position(727, 616), true);
let Con = new Province(['Con', 'Constantinople'], provinceTypes.coastal, true, subProvinces["Con"], `${provincePath}Cons.png`, new Position(629, 615), new Position(650, 630), true);
let Smy = new Province(['Smy', 'Smyrna'], provinceTypes.coastal, true, subProvinces["Smy"], `${provincePath}Smy.png`, new Position(635, 631), new Position(690, 690), true);
let Syr = new Province(['Syr', 'Syria'], provinceTypes.coastal, false, subProvinces["Syr"], `${provincePath}Syr.png`, new Position(792, 660), new Position(836, 696), false);
let Arm = new Province(['Arm', 'Armenia'], provinceTypes.coastal, false, subProvinces["Arm"], `${provincePath}Arm.png`, new Position(832, 587), new Position(864, 635), false);
let Sev = new Province(['Sev', 'Sevastopol'], provinceTypes.coastal, true, subProvinces["Sev"], `${provincePath}Sev.png`, new Position(649, 371), new Position(850, 500), true);
let Mos = new Province(['Mos', 'Moscow'], provinceTypes.inland, true, subProvinces["Mos"], `${provincePath}Mos.png`, new Position(590, 176), new Position(690, 340), true);
let War = new Province(['War', 'Warsaw'], provinceTypes.inland, true, subProvinces["War"], `${provincePath}War.png`, new Position(505, 377), new Position(550, 420), true);
let StP = new Province(['StP', 'St. Petersburg'], provinceTypes.coastal, true, subProvinces["StP"], `${provincePath}StP.png`, new Position(575, 1), new Position(680, 220), true);
let Ukr = new Province(['Ukr', 'Ukraine'], provinceTypes.inland, false, subProvinces["Ukr"], `${provincePath}Ukr.png`, new Position(595, 396), new Position(650, 450), false);
let Lvn = new Province(['Lvn', 'Livonia'], provinceTypes.coastal, false, subProvinces["Lvn"], `${provincePath}Lvn.png`, new Position(545, 264), new Position(600, 330), false);
let Fin = new Province(['Fin', 'Finland'], provinceTypes.coastal, false, subProvinces["Fin"], `${provincePath}Fin.png`, new Position(538, 47), new Position(600, 180), false);

const provinces = {
    "Turkey": [Ank, Con, Smy, Arm, Syr],
    "Russia": [Sev, Mos, War, StP, Ukr, Lvn, Fin],
    // "Other": [Syr, Arm, Ukr, Lvn, Fin]
}

let getUnits = function(provinces: InstanceType<typeof Province>[]) {
    let collected = [];
    for (var i = 0; i < provinces.length; i++) {
        collected.push(provinces[i].getUnit());
    }
    return collected;
}

let Turkey = new Country('Turkey', provinces["Turkey"], getUnits(provinces["Turkey"]), '#FFDA7F');
let Russia = new Country('Russia', provinces["Russia"], getUnits(provinces["Russia"]), '#E4E4E4');

const countries = [Turkey, Russia]

const allProvinces = () => {
    let collected = [];
    let provincesArray = Object.values(provinces);
    for (var i = 0; i < provincesArray.length; i++) {
        collected = collected.concat(provincesArray[i]);
    }
    return collected;
}

let Game1 = new Game(getUnits(allProvinces()), allProvinces(), countries, ['Spring', 'Fall'], Object.values(turnPhases), new Position(915, 767));

module.exports.Game1 = Game1;