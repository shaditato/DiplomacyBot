const Canvas = require('canvas');

// unit types
//  requires: each is unique
let army = 0;
let fleet = 1;

class Unit {
    type: number;
    imageDir: string;
    displaced: boolean;

    constructor (type: number, imageDir: string) {
        this.type = type; // Any -> army, fleet
        this.imageDir = imageDir;
        this.displaced = false; // Bool -> displaced after losing battle
    }

    getType() {
        return this.type;
    }
    getImageDir() {
        return this.imageDir;
    }
    getCountry(countries: Country[]) {
        for (var i = 0; i < countries.length; i++) {
            let country = countries[i];
            if (country.units.includes(this)) {
                return country;
            }
        }
    }
    getSubProvince(provinces: Province[]) {
        for (var i = 0; i < provinces.length; i++) {
            let province = provinces[i];
            if (province.getUnit() == this) {
                let subProvinces = province.getSubProvinces()
                for (var i = 0; i < subProvinces.length; i++) {
                    let subProvinceUnit = subProvinces[i].getUnit();
                    if (subProvinceUnit) return subProvinceUnit;
                }
            }
        }
    }
    getProvince(provinces: Province[]) {
        for (var i = 0; i < provinces.length; i++) {
            let province = provinces[i];
            if (province.getUnit() == this) {
                return province;
            }
        }
    }

}

class Position {
    x: number;
    y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

// province types
//  requires: each is unique
let inland = 0;
let water = 1;
let coastal = 2;

class SubProvince {
    name: string;
    occupiedBy: Unit;
    newUnit: Unit;
    displacedUnit: Unit;
    adjacentTo: SubProvince[];

    constructor(name: string, occupier: Unit) {
        this.name = name;
        this.occupiedBy = occupier;
        this.newUnit;
        this.displacedUnit;
        this.adjacentTo;
    }

    getName() {
        return this.name;
    }
    getUnit() {
        return this.occupiedBy;
    }
    getNewUnit() {
        return this.newUnit;
    }
    getAdjacent() {
        return this.adjacentTo;
    }
    addUnit(unit: Unit) {
        this.newUnit = unit;
    }
    removeUnit() {
        this.occupiedBy = null;
    }
    updateUnit() {
        if (this.occupiedBy && this.newUnit) {
            this.displacedUnit = this.occupiedBy;
        }
        if (this.newUnit) {
            this.occupiedBy = this.newUnit;
            this.newUnit = null;
        }
    }
    setAdjacent(adjacent: SubProvince[]) {
        this.adjacentTo = adjacent;
    }
    getParent(provinces: Province[]) {
        for (var i = 0; i < provinces.length; i++) {
            let province = provinces[i];
            if (province.getSubProvinces().includes(this)) return province;
        }
    }
}

class Province {
    name: [string, string];
    type: number;
    pr: boolean;
    subProvinces: SubProvince[];
    occupied: boolean;
    imageDir: string;
    provPosn: Position;
    unitPosn: Position;

    constructor (name: [string, string], type: number, prBool: boolean, subProvinces: SubProvince[],
                imageDir: string, provPosn: Position, unitPosn: Position, occupied: boolean) {
        this.name = name; // [abbreviated, full]
        this.type = type; // Any -> inland, water, coastal
        this.pr = prBool; // Bool -> province is PR
        this.subProvinces = subProvinces; // note: all subprovinces.getName() include this.name
        this.occupied = occupied; // Unit -> current occupied
        this.imageDir = imageDir; // directory of image
        this.provPosn = provPosn; // { x: int, y: int } -> draw prov x y
        this.unitPosn = unitPosn; // { x: int, y: int } -> draw unit x y
    }

    getName() {
        return this.name;
    }
    getUnit() {
        if (!this.occupied) return null;
        else {
            for (var i = 0; i < this.subProvinces.length; i++) {
                let unit = this.subProvinces[i].getUnit();
                if (unit) return unit;
            }
        }
    }
    getCountry(countries: Country[]) { // returns current owner
        for (var i = 0; i < countries.length; i++) {
            let country = countries[i];
            if (country.getLand().includes(this)) return country;
        }
        return null;
    }
    getProvPosn() {
        return this.provPosn;
    }
    getUnitPosn() {
        return this.unitPosn;
    }
    getNewestUnit() {
        for (var i = 0; i < this.subProvinces.length; i++) {
            let unit = this.subProvinces[i].getNewUnit();
            if (unit) return unit;
        }
        for (var i = 0; i < this.subProvinces.length; i++) {
            let unit = this.subProvinces[i].getUnit();
            if (unit) return unit;
        }
    }
    getSubProvinces() {
        return this.subProvinces;
    }
    getOccupiedSubProvince() {
        if (!this.occupied) return null;
        else {
            for (var i = 0; i < this.subProvinces.length; i++) {
                let subProvince = this.subProvinces[i]
                if (subProvince.getUnit()) return subProvince;
            }
        }
    }
    getImageDir() {
        return this.imageDir;
    }
    removeUnit() {
        if (!this.occupied) return;
        else {
            for (var i = 0; i < this.subProvinces.length; i++) {
                let unit = this.subProvinces[i].getUnit();
                if (unit) {
                    this.subProvinces[i].removeUnit();
                    break;
                }
            }
            this.occupied = false;
        }
    }
    occupy() {
        this.occupied = true;
    }
    addUnit(unit: Unit, subProvince: SubProvince) {
        for (var i = 0; i < this.subProvinces.length; i++) {
            let subProvince_i = this.subProvinces[i]
            if (subProvince_i == subProvince) {
                subProvince_i.addUnit(unit);
                this.occupy();
            }
        }
    } 
    isOccupied() {
        return this.occupied;
    }
    isPR() {
        return this.pr;
    }
    isAttacked(orders: Order[], countries: Country[]) { // [listof Order] -> Bool
        for (var i = 0; i < orders.length; i++) {
            let order = orders[i];
            if (this.getSubProvinces().includes(order.getDest()) && order.getType() == move // destination and attack
                && (!this.isOccupied() || order.getCountry() != this.getUnit().getCountry(countries))) { // not same country
                return true;
            }
        }
        return false;
    }

}

class Country {
    name: string;
    land: Province[];
    pr: Province[];
    home: Province[];
    colour: string; // hex colour
    units: Unit[];

    constructor (name: string, land: Province[], units: Unit[], colour: string) {
        this.name = name; // Str -> name of country
        this.land = land; // [listof Province] -> country total pr owned
        this.home = land.filter(province => province.isPR()); // [listof Province] -> country home pr
        this.colour = colour; // HEX -> country colour
        this.units = units;
    }

    getName() {
        return this.name;
    }
    getLand() {
        return this.land;
    }
    getPR() {
        return this.land.filter(province => province.isPR());
    }
    getColour() {
        return this.colour;
    }

    hasUnit(unit: Unit) { // Unit -> Bool
        if (this.units.includes(unit)) {
            return true;
        } else {
            return false;
        }
    }
}

// move types
//  requires: each is unique
let move = 0;
let offSupport = 1;
let hold = 2;
let defSupport = 3;
let unitConvoy = 4;
let fleetConvoy = 5;

class Order {
    country: Country;
    unit: Unit;
    type: number;
    origin: SubProvince;
    dest: SubProvince;
    strength: Number;
    successful: Boolean;

    constructor (country: Country, unit: Unit, type: number, origin: SubProvince, dest: SubProvince) {
        this.country = country;
        this.unit = unit; // Unit -> unit carrying order
        this.type = type; // Any -> move, offSupport, hold, defSupport, unitConvoy, fleetConvoy
        this.origin = origin; // origin province of order
        this.dest = dest; // Province -> destination for order
        this.strength = 1; // Int -> support in order 
        this.successful;
    }
    
    getCountry() {
        return this.country;
    }
    getUnit() {
        return this.unit;
    }
    getType() {
        return this.type;
    }
    getOrigin() {
        return this.origin;
    }
    getDest() {
        return this.dest;
    }
    success(works: boolean) {
        this.successful = works;
    }
    cancelToHold() {
        this.type = hold;
        this.dest = null;
        this.success(false);
    }
}

class OrderResolver {
}

// turn phases
//  requires: each is unique
let orders = 0;
let resolution = 1;
let retreat = 2;
let build = 3;

class Turn {
    season: string;
    year: number;
    phase: number;
    orders: Order[];
    resolvedOrders: Order[];

    constructor (season: string, year: number, phase: number) {
        this.season = season;
        this.year = year;
        this.phase = phase; // Any -> turn type
        this.orders = []; // [listof Orders] or null
        this.resolvedOrders = [];
    }

    resetOrders() { // void -> void, mutates self
        this.orders = [];
    }

    addOrders(newOrders: Order[]) { // [listof Order] -> void, mutates self
        this.orders = this.orders.filter(order => order != null).concat(newOrders);
    }

    clearOrdersByCountry(country: Country) { // Country -> void, mutates self
        this.orders = this.orders.filter(order => order.getCountry() != country);
    }

    sortOrdersByType(types: number[]) { // [listof Any] -> void, mutates self (requires types in order of priority)
        let sorted2D = [];
        for (var i = 0; i < types.length; i++) {
            let type = types[i]
            sorted2D.push(this.orders.filter(order => order.type == type));
        }

        let sortedOrders = []; 
        for (var i = 0; i < sorted2D.length; i++) {
            sortedOrders = sortedOrders.concat(sorted2D[i]);
        }

        this.orders = sortedOrders;
    }

    sortOrdersByCountry(countries: Country[]) { // [listof Country] -> void, mutates self
        let sorted2D = [];
        for (var i = 0; i < countries.length; i++) {
            let country = countries[i]
            sorted2D.push(this.orders.filter(order => order.country == country));
        }

        let sortedOrders = []; 
        for (var i = 0; i < sorted2D.length; i++) {
            sortedOrders = sortedOrders.concat(sorted2D[i]);
        }
        
        this.orders = sortedOrders;
    }

    resolveOrders(provinces: Province[]) { // void -> void, self-mutates (requires orders sorted by type in correct priority)
        // priority: <offSupport, defSupport>, <move>, <fleetConvoy, unitConvoy, hold>

        for (var i = 0; i < this.orders.length; i++) {
            let order = this.orders[i];
            if (order.getType() == move) {
                order.getDest().getParent(provinces).addUnit(order.getUnit(), order.getDest());
                order.getOrigin().getParent(provinces).removeUnit();
            }
        }
        this.resetOrders();
    }

}

class Game {
    units: Unit[];
    provinces: Province[];
    countries: Country[];
    seasons: string[];
    phases: number[];
    turn: Turn;
    dimensions: Position;

    constructor (allUnits: Unit[], allProvinces: Province[], allCountries: Country[], seasons: string[], phases: number[], dim: Position) {
        this.units = allUnits; // [listof Unit]
        this.provinces = allProvinces; // [listof Province]
        this.countries = allCountries; // [listof Country]
        this.seasons = seasons; // [listof Str] -> turns per year, requires: non-empty
        this.phases = phases; // [listof Any] -> orders, resolution, retreat, build
        this.turn; // Turn or null
        this.dimensions = dim;
    }

    getProvinces() {
        return this.provinces;
    }
    getCountries() {
        return this.countries;
    }
    getCountryByName(str) {
        let country = this.countries.filter(country => country.getName().toLowerCase() == str.toLowerCase())[0]
        if (!country) return null;
        else return country;
    }
    getTime() {
        return `${this.turn.season} ${this.turn.year}`
    }
    // start the game
    start(firstYear: number, firstPhase: number) { // Int -> void, mutates self
        this.turn = new Turn(this.seasons[0], firstYear, firstPhase)
    }
    // go to the next turn
    nextTurn() {
        // change season/year
        let currentSeasonIndex = this.seasons.indexOf(this.turn.season)
        if (currentSeasonIndex == (this.seasons.length - 1)) { // last season
            this.turn.season = this.seasons[0];
            this.turn.year++;
        } else {
            this.turn.season = this.seasons[currentSeasonIndex + 1];
        }
        this.turn.resolveOrders(this.provinces);
        for (var i = 0; i < this.provinces.length; i++) {
            for (var z = 0; z < this.provinces[i].subProvinces.length; z++) {
                this.provinces[i].subProvinces[z].updateUnit();
            }
        }
    }
    makeOrderFromString(str: string) { // returns string if error, else returns Order
        let splitStr = str.toLowerCase().split(/ +/);
        // GET UNIT TYPE (unitType)
        let strUnitType = splitStr[0]
        if (strUnitType == 'a') var unitType = army;
        else if (strUnitType == 'f') var unitType = fleet;
        else return `Invalid Unit Type: ${splitStr[0]}`;
        // GET ORIGIN SUBPROVINCE (origin)
        if (!splitStr[1]) return 'No Origin Province Specified';
        var origin: SubProvince;
        let provinces = this.getProvinces()
        for (var i = 0; i < provinces.length; i++) {
            let province = provinces[i];
            let provinceName = province.getName()[0].toLowerCase()
            let strOrigin = splitStr[1].slice(0, provinceName.length);
            if (strOrigin.includes(provinceName)) {
                let occSubProvince = province.getOccupiedSubProvince();
                if (occSubProvince.getName().toLowerCase() == strOrigin) { 
                    origin = occSubProvince;
                    break;
                }
            }
        }
        if (!origin) return `Origin Province Not Found: ${splitStr[1]}`;
        // no unit or origin unit type is consistent with string
        if (!origin.getUnit() || origin.getUnit().getType() != unitType) return 'Unit Not Found';
        // GET ORDERTYPE (orderType)
        if (splitStr[2] && splitStr[2] == 'holds') var orderType = hold;
        else if (splitStr[2] && splitStr[2] == 'C') var orderType = fleetConvoy;
        else if (splitStr[1].slice(3).startsWith('-')) var orderType = move;
        else return 'Order Type Could Not Be Determined';
        // GET DESTINATION SUBPROVINCE
        var dest: SubProvince;
        let strDest = splitStr[1].slice(origin.getName().length+1);
        if (orderType == move) {
            for (var i = 0; i < provinces.length; i++) {
                let province = provinces[i];
                if (strDest.includes(province.getName()[0].toLowerCase())) {
                    dest = province.getSubProvinces().filter(subProvince => (origin.getAdjacent().includes(subProvince) && (subProvince.getName().toLowerCase() == strDest)))[0]
                    break;
                }
            }
        }
        if (!dest) return 'Destination Province Not Found';

        return new Order(origin.getUnit().getCountry(this.getCountries()), origin.getUnit(), orderType, origin, dest);
    }
    async drawCanvas() {
        // === DRAW BACKGROUND (water) ===
        let bg = Canvas.createCanvas(this.dimensions.x, this.dimensions.y);
        let bgctx = bg.getContext('2d');
        // water
        let backgroundGradient = bgctx.createLinearGradient(0, this.dimensions.y, 0, 0);
        backgroundGradient.addColorStop(0, '#7F92FF');
        backgroundGradient.addColorStop(1, '#7FC8FF');
        bgctx.fillStyle = backgroundGradient;
        bgctx.fillRect(0, 0, bg.width, bg.height);
        // === DRAW PROVINCES + UNITS ===
        let prov = Canvas.createCanvas(this.dimensions.x, this.dimensions.y);
        let provctx = prov.getContext('2d');
        // let canvas = <HTMLCanvasElement> document.getElementById('liveCanvas'); // html
        for (var i = 0; i < this.provinces.length; i++) {
            let canvas = Canvas.createCanvas(this.dimensions.x, this.dimensions.y);
            let ctx = canvas.getContext('2d');
            let province = this.provinces[i];
            let provinceCountry = province.getCountry(this.countries);
            let provinceImg = await Canvas.loadImage(province.getImageDir());
            let provPosn = province.getProvPosn();
            let colour = provinceCountry ? provinceCountry.getColour() : 'white';
            // draw colour rect
            ctx.fillStyle = colour;
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillRect(provPosn.x, provPosn.y, provinceImg.width, provinceImg.height);
            // draw province img
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(provinceImg, provPosn.x, provPosn.y);
            // draw unit img w/ shadow
            ctx.globalCompositeOperation = 'source-over';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 2;
            let unit = province.getNewestUnit();
            if (unit) {
                let unitPosn = province.getUnitPosn();
                ctx.drawImage(await Canvas.loadImage(unit.getImageDir()), unitPosn.x, unitPosn.y);
            }
            provctx.drawImage(canvas, 0, 0);
        }
        // === DRAW PROVINCE GLOW ===
        provctx.globalCompositeOperation = 'destination-over';
        provctx.shadowBlur = 30;
        for (var i = 0; i < this.provinces.length; i++) {
            let province = this.provinces[i];
            let provinceCountry = province.getCountry(this.countries);
            let provinceImg = await Canvas.loadImage(province.getImageDir());
            let provPosn = province.getProvPosn();
            let colour = provinceCountry ? provinceCountry.getColour() : 'white';
            provctx.shadowColor = colour;
            provctx.drawImage(provinceImg, provPosn.x, provPosn.y);
        }
        // === DRAW PROVINCE OUTLINES (labels + pr) ===
        bgctx.drawImage(await Canvas.loadImage('./maps/standard/outline.png'), 0, 0);
        
        bgctx.drawImage(prov, 0, 0);
        return bg.toBuffer();
    }
}

module.exports.classes = { 
    dUnit: Unit,
    dPosition: Position,
    dSubProvince: SubProvince,
    dProvince: Province,
    dCountry: Country,
    dOrder: Order,
    dTurn: Turn,
    dGame: Game
}

module.exports.unitTypes = {
    army: army,
    fleet: fleet
}

module.exports.orderTypes = {
    move: move,
    offSupport: offSupport,
    hold: hold,
    defSupport: defSupport,
    unitConvoy: unitConvoy,
    fleetConvoy: fleetConvoy
}

module.exports.provinceTypes = {
    inland: inland,
    water: water,
    coastal: coastal
}

module.exports.turnPhases = {
    order: orders,
    resolution: resolution,
    retreat: retreat,
    build: build
}