import * as Engine from '../../engine';
const { 
    army, fleet,                                            // UNIT TYPES
    inland, water, coastal,                                 // PROVINCE TYPES
    orders, resolution, retreat, build,                     // TURN PHASES
    Unit, SubProvince, Position, Province, Country, Game    // GAME ENGINE CLASSES
} = Engine;

const rootPath = './dip/maps/standard/';
const provincePath = `${rootPath}provinces/`;
const unitPath = `${rootPath}units/`;

// === SUBPROVINCES ===

// turkey 
const ankInland = new SubProvince('Ank', null);
const ankCoast = new SubProvince('Ank', new Unit(fleet, `${unitPath}Turkey1.png`));
const conInland = new SubProvince('Con', new Unit(army, `${unitPath}Turkey0.png`));
const conCoast = new SubProvince('Con', null);
const smyInland = new SubProvince('Smy', new Unit(army, `${unitPath}Turkey0.png`));
const smyCoast = new SubProvince('Smy', null);
const syrInland = new SubProvince('Syr', null);
const syrCoast = new SubProvince('Syr', null);
const armInland = new SubProvince('Arm', null);
const armCoast = new SubProvince('Arm', null);
// russia
const sevInland = new SubProvince('Sev', null);
const sevCoast = new SubProvince('Sev', new Unit(fleet, `${unitPath}Russia1.png`));
const mosInland = new SubProvince('Mos', new Unit(army, `${unitPath}Russia0.png`));
const warInland = new SubProvince('War', new Unit(army, `${unitPath}Russia0.png`));
const stpInland = new SubProvince('StP', null);
const stpNc = new SubProvince('StP', null);
const stpSc = new SubProvince('StP', new Unit(fleet, `${unitPath}Russia1.png`));
const ukrInland = new SubProvince('Ukr', null);
const lvnInland = new SubProvince('Lvn', null);
const lvnCoast = new SubProvince('Lvn', null);
const finInland = new SubProvince('Fin', null);
const finCoast = new SubProvince('Fin', null);

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
};

// === PROVINCES === 

const Ank = new Province(['Ank', 'Ankara'], coastal, true, subProvinces["Ank"], `${provincePath}Ank.png`, new Position(704, 598), new Position(727, 616), true);
const Con = new Province(['Con', 'Constantinople'], coastal, true, subProvinces["Con"], `${provincePath}Cons.png`, new Position(629, 615), new Position(650, 630), true);
const Smy = new Province(['Smy', 'Smyrna'], coastal, true, subProvinces["Smy"], `${provincePath}Smy.png`, new Position(635, 631), new Position(690, 690), true);
const Syr = new Province(['Syr', 'Syria'], coastal, false, subProvinces["Syr"], `${provincePath}Syr.png`, new Position(792, 660), new Position(836, 696), false);
const Arm = new Province(['Arm', 'Armenia'], coastal, false, subProvinces["Arm"], `${provincePath}Arm.png`, new Position(832, 587), new Position(864, 635), false);
const Sev = new Province(['Sev', 'Sevastopol'], coastal, true, subProvinces["Sev"], `${provincePath}Sev.png`, new Position(649, 371), new Position(850, 500), true);
const Mos = new Province(['Mos', 'Moscow'], inland, true, subProvinces["Mos"], `${provincePath}Mos.png`, new Position(590, 176), new Position(690, 340), true);
const War = new Province(['War', 'Warsaw'], inland, true, subProvinces["War"], `${provincePath}War.png`, new Position(505, 377), new Position(550, 420), true);
const StP = new Province(['StP', 'St. Petersburg'], coastal, true, subProvinces["StP"], `${provincePath}StP.png`, new Position(575, 1), new Position(680, 220), true);
const Ukr = new Province(['Ukr', 'Ukraine'], inland, false, subProvinces["Ukr"], `${provincePath}Ukr.png`, new Position(595, 396), new Position(650, 450), false);
const Lvn = new Province(['Lvn', 'Livonia'], coastal, false, subProvinces["Lvn"], `${provincePath}Lvn.png`, new Position(545, 264), new Position(600, 330), false);
const Fin = new Province(['Fin', 'Finland'], coastal, false, subProvinces["Fin"], `${provincePath}Fin.png`, new Position(538, 47), new Position(600, 180), false);

const provinces = {
    "Turkey": [Ank, Con, Smy, Arm, Syr],
    "Russia": [Sev, Mos, War, StP, Ukr, Lvn, Fin],
    // "Other": [Syr, Arm, Ukr, Lvn, Fin]
}

const Turkey = new Country('Turkey', provinces["Turkey"], '#FFDA7F');
const Russia = new Country('Russia', provinces["Russia"], '#E4E4E4');

const countries = [Turkey, Russia];

const Game1 = new Game(countries, ['Spring', 'Fall'], [orders, resolution, retreat, build], new Position(915, 767));

module.exports.Game1 = Game1;