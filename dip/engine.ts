import Canvas from "canvas";

// =================================================
// === UNIT, PROVINCE, ORDER TYPES + TURN PHASES ===
// =================================================
// requires: each instance of a specific type has a unique & truthy value

type unitType = 'ARMY' | 'FLEET';
type provinceType = 'INLAND' | 'WATER' | 'COASTAL';
type orderType = 'MOVE' | 'OFFENSIVE_SUPPORT' | 'HOLD' | 'DEFENSIVE_SUPPORT' | 'UNIT_CONVOY' | 'FLEET_CONVOY';
type turnPhase = 'ORDERS' | 'RESOLUTION' | 'RETREAT' | 'BUILD';

export const army: unitType = 'ARMY';
export const fleet: unitType = 'FLEET';

export const inland: provinceType = 'INLAND';
export const water: provinceType = 'WATER';
export const coastal: provinceType = 'COASTAL';

export const move: orderType = 'MOVE';
export const offSupport: orderType = 'OFFENSIVE_SUPPORT';
export const hold: orderType = 'HOLD';
export const defSupport: orderType = 'DEFENSIVE_SUPPORT';
export const unitConvoy: orderType = 'UNIT_CONVOY';
export const fleetConvoy: orderType = 'FLEET_CONVOY';

export const orders: turnPhase = 'ORDERS';
export const resolution: turnPhase = 'RESOLUTION';
export const retreat: turnPhase = 'RETREAT';
export const build: turnPhase = 'BUILD';

// =====================================
// === GAME ENGINE CLASS DEFINITIONS ===
// =====================================

export class Unit {
    private _displaced: boolean = false;
    constructor (
        private _type: unitType,
        private _imageDir: string
    ) {}

    get type() { 
        return this._type; 
    }
    get imageDir() {
        return this._imageDir;
    }
    get displaced() {
        return this._displaced;
    }
    getCountry(countries: Country[]) {
        for (let i = 0; i < countries.length; i++) {
            let country = countries[i];
            if (country.units.includes(this)) {
                return country;
            }
        }
    }
    getSubProvince(provinces: Province[]) {
        for (let i = 0; i < provinces.length; i++) {
            let province = provinces[i];
            if (province.unit == this) {
                let subProvinces = province.subProvinces;
                for (let i = 0; i < subProvinces.length; i++) {
                    let subProvinceUnit = subProvinces[i].currentUnit;
                    if (subProvinceUnit) return subProvinceUnit;
                }
            }
        }
    }
    getProvince(provinces: Province[]) {
        for (let i = 0; i < provinces.length; i++) {
            let province = provinces[i];
            if (province.unit == this) {
                return province;
            }
        }
    }
}

export class Position {
    constructor (
        readonly x: number, 
        readonly y: number
    ) {}
}

export class SubProvince {
    private _newUnit: Unit;
    private _displacedUnit: Unit;
    private _adjacents: SubProvince[];
    constructor(
        private _name: string, 
        private _currentUnit: Unit
    ) {}
    get name() {
        return this._name;
    }
    get currentUnit() {
        return this._currentUnit;
    }
    get occupied() {
        return !!this._currentUnit;
    }
    get newUnit() {
        return this._newUnit;
    }
    get displacedUnit() {
        return this._displacedUnit;
    }
    get adjacents() {
        return this._adjacents;
    }
    addUnit(unit: Unit) {
        this._newUnit = unit;
    }
    setAdjacent(adjacents: SubProvince[]) {
        this._adjacents = adjacents;
    }
    removeUnit() {
        this._currentUnit = null;
    }
    updateUnit() {
        if (this._currentUnit && this._newUnit) {
            this._displacedUnit = this._currentUnit;
        }
        if (this._newUnit) {
            this._currentUnit = this.newUnit;
            this._newUnit = null;
        }
    }
    getParent(provinces: Province[]) {
        return provinces.find(province => province.subProvinces.includes(this));
    }
}

export class Province {
    constructor (
        private _name: [string, string], // first string must be three characters
        private _type: provinceType, 
        private _pr: boolean, 
        private _subProvinces: SubProvince[],
        private _imageDir: string, 
        private _provPosn: Position, 
        private _unitPosn: Position, 
        private _occupied: boolean
    ) {}

    get name() {
        return this._name;
    }
    get type() {
        return this._type;
    }
    get occupied() {
        return this._occupied;
    }
    get pr() {
        return this._pr;
    }
    get provPosn() {
        return this._provPosn;
    }
    get unitPosn() {
        return this._unitPosn;
    }
    get subProvinces() {
        return this._subProvinces;
    }
    get occupiedSubProvince() {
        if (!this._occupied) return null;
        else return this._subProvinces.find(subProvince => subProvince.currentUnit);
    }
    get unit() {
        if (!this._occupied) return null;
        else return this.occupiedSubProvince.currentUnit;
    }
    get imageDir() {
        return this._imageDir;
    }
    get newestUnit() {
        const { newUnit } = this._subProvinces.find(subProvince => subProvince.newUnit) || {};
        if (newUnit) return newUnit;
        const { currentUnit } = this._subProvinces.find(subProvince => subProvince.currentUnit) || {};
        if (currentUnit) return currentUnit;
        return null;
    }
    getCountry(countries: Country[]) { // returns current owner
        const country = countries.find(country => country.provinces.includes(this));
        if (country) return country;
        else return null;
    }
    addUnit(unit: Unit, subProvince: SubProvince) {
        if (!this._subProvinces.includes(subProvince)) return;
        else {
            subProvince.addUnit(unit);
            this._occupied = true;
        }
    } 
    removeUnit() {
        if (!this._occupied) return;
        else {
            this.occupiedSubProvince.removeUnit();
            this._occupied = false;
        }
    }
    isAttacked(orders: Order[], countries: Country[]) { // [listof Order] -> Bool
        return !!(orders.find(order => { 
            this.subProvinces.includes(order.dest) 
            && order.type == move // destination and attack
            && (!this.occupied || order.country != this.unit.getCountry(countries))
        }))
    }
}

export class Country {
    private _home: Province[];
    constructor (
        private _name: string, 
        private _provinces: Province[], 
        private _colour: string
    ) {
        this._home = this._provinces.filter(province => province.pr); // all starting land that are pr
    }

    get name() {
        return this._name;
    }
    get provinces() {
        return this._provinces;
    }
    get home() {
        return this._home;
    }
    get pr() {
        return this._provinces.filter(province => province.pr);
    }
    get units() {
        return this._provinces.map(province => province.unit).filter(unit => unit);
    }
    get colour() {
        return this._colour;
    }
    hasUnit(unit: Unit) { // Unit -> Bool
        return this.units.includes(unit);
    }
    
}

export class Order {
    private _strength: Number = 1;
    private _successful: Boolean;
    constructor (
        private _country: Country, 
        private _unit: Unit, 
        private _type: orderType, 
        private _origin: SubProvince, 
        private _dest: SubProvince
    ) {}
    
    get country() {
        return this._country;
    }
    get unit() {
        return this._unit;
    }
    get type() {
        return this._type;
    }
    get origin() {
        return this._origin;
    }
    get dest() {
        return this._dest;
    }
    get strength() {
        return this._strength;
    }
    get successful() {
        return this._successful;
    }
    setSuccess(status: boolean) {
        this._successful = status;
    }
    cancelToHold() {
        this._type = hold;
        this._dest = null;
        this.setSuccess(false);
    }
}

export class OrderResolver {}; 

export class Turn { // to be deprecated and functionality given to Game and OrderResolver classes 
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
    get name() {
        return `${this.season} ${this.year}`
    }
    resetOrders() { // void -> void, mutates self
        this.orders = [];
    }
    addOrders(newOrders: Order[]) { // [listof Order] -> void, mutates self
        this.orders = this.orders.filter(order => order != null).concat(newOrders);
    }
    clearOrdersByCountry(country: Country) { // Country -> void, mutates self
        this.orders = this.orders.filter(order => order.country != country);
    }
    sortOrdersByType(types: orderType[]) { // [listof Any] -> void, mutates self (requires types in order of priority)
        let sorted2D = [];
        for (let i = 0; i < types.length; i++) {
            let type = types[i]
            sorted2D.push(this.orders.filter(order => order.type == type));
        }
        let sortedOrders = []; 
        for (let i = 0; i < sorted2D.length; i++) {
            sortedOrders = sortedOrders.concat(sorted2D[i]);
        }
        this.orders = sortedOrders;
    }
    sortOrdersByCountry(countries: Country[]) { // [listof Country] -> void, mutates self
        let sorted2D = [];
        for (let i = 0; i < countries.length; i++) {
            let country = countries[i]
            sorted2D.push(this.orders.filter(order => order.country == country));
        }
        let sortedOrders = []; 
        for (let i = 0; i < sorted2D.length; i++) {
            sortedOrders = sortedOrders.concat(sorted2D[i]);
        }
        this.orders = sortedOrders;
    }
    resolveOrders(provinces: Province[]) { // void -> void, self-mutates (requires orders sorted by type in correct priority)
        // priority: <offSupport, defSupport>, <move>, <fleetConvoy, unitConvoy, hold>

        for (let i = 0; i < this.orders.length; i++) {
            let order = this.orders[i];
            if (order.type == move) {
                order.dest.getParent(provinces).addUnit(order.unit, order.dest);
                order.origin.getParent(provinces).removeUnit();
            }
        }
        this.resetOrders();
    }
}

export class Game {

    private _units: Unit[];
    private _provinces: Province[];
    private _turn: Turn;

    constructor (
        private _countries: Country[], 
        private _seasons: string[], 
        private _phases: turnPhase[], 
        private _dimensions: Position
    ) {
        this._units = this._countries.flatMap(country => country.units);
        this._provinces = this._countries.flatMap(country => country.provinces);
    }

    get units() {
        return this._units;
    }
    get provinces() {
        return this._provinces;
    }
    get subProvinces() {
        return this._provinces.flatMap(province => province.subProvinces);
    }
    get countries() {
        return this._countries;
    }
    get seasons() {
        return this._seasons;
    }
    get phases() {
        return this._phases;
    }
    get turn() {
        return this._turn;
    }
    get dimensions() {
        return this._dimensions;
    }
    getCountryByName(str: string) {
        return this._countries.find(country => country.name.toLowerCase() == str.toLowerCase());
    }
    // start the game
    start(firstYear: number, firstPhase: number) { // Int -> void, mutates self
        this._turn = new Turn(this.seasons[0], firstYear, firstPhase)
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
        for (let i = 0; i < this.provinces.length; i++) {
            for (let z = 0; z < this.provinces[i].subProvinces.length; z++) {
                this.provinces[i].subProvinces[z].updateUnit();
            }
        }
    }
    makeOrderFromString(str: string) { // returns string if error, else returns Order
        const [strUnitType, strOriginProvince, strOrderType, strDestProvince] = str.toLowerCase().split(/ +/);
        let splitStr = str.toLowerCase().split(/ +/);

        // GET UNIT TYPE (unitType)
        const unitType = strUnitType.startsWith('a') ? army : (strUnitType.startsWith('f') ? fleet : undefined);
        if (unitType === undefined) return `Invalid Unit Type '${strUnitType.toUpperCase()}'`;

        // GET ORIGIN SUBPROVINCE (origin)
        if (!strOriginProvince) return 'No Origin Province Specified';
        let origin = this.subProvinces.find(subProvince => (subProvince.name.toLowerCase() == strOriginProvince) && (subProvince.occupied));
        if (!origin) {
            origin = this.subProvinces.find(subProvince => subProvince.getParent(this._provinces).name[1].toLowerCase().startsWith(strOriginProvince) && subProvince.occupied);
        }
        if (!origin) return `Origin Province '${strOriginProvince.toUpperCase()}' Not Found`;
        if (origin.currentUnit.type != unitType) return 'Unit Not Found';

        // GET ORDERTYPE (orderType)
        if (!strOrderType) return 'No Order Type Specified';
        let orderType;
        if (strOrderType.startsWith('h')) orderType = hold;
        else if (strOrderType.startsWith('c')) orderType = fleetConvoy;
        else orderType = move;

        // GET DESTINATION SUBPROVINCE
        let dest: SubProvince;
        if (orderType == move) {
            if (!strDestProvince) return 'No Destination Province Specified';
            dest = origin.adjacents.find(subProvince => (subProvince.name.toLowerCase() == strDestProvince) || subProvince.getParent(this._provinces).name[1].toLowerCase().startsWith(strDestProvince));
            if (!dest) return 'Destination Province Not Found';
        }

        return new Order(origin.currentUnit.getCountry(this._countries), origin.currentUnit, orderType, origin, dest);
    }
    async drawCanvas() {
        // === DRAW BACKGROUND (water) ===
        const bg = Canvas.createCanvas(this.dimensions.x, this.dimensions.y);
        const bgctx = bg.getContext('2d');
        // water
        const backgroundGradient = bgctx.createLinearGradient(0, this.dimensions.y, 0, 0);
        backgroundGradient.addColorStop(0, '#7F92FF');
        backgroundGradient.addColorStop(1, '#7FC8FF');
        bgctx.fillStyle = backgroundGradient;
        bgctx.fillRect(0, 0, bg.width, bg.height);

        // === DRAW PROVINCES + UNITS ===
        const prov = Canvas.createCanvas(this.dimensions.x, this.dimensions.y);
        const provctx = prov.getContext('2d');
        // const canvas = <HTMLCanvasElement> document.getElementById('liveCanvas'); // html
        for (let i = 0; i < this.provinces.length; i++) {
            const canvas = Canvas.createCanvas(this.dimensions.x, this.dimensions.y);
            const ctx = canvas.getContext('2d');
            const province = this.provinces[i];
            const provinceCountry = province.getCountry(this.countries);
            const provinceImg = await Canvas.loadImage(province.imageDir);
            const { provPosn } = province;
            // draw colour rect for province
            ctx.fillStyle = provinceCountry ? provinceCountry.colour : 'white';
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillRect(provPosn.x, provPosn.y, provinceImg.width, provinceImg.height);
            // draw province img
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(provinceImg, provPosn.x, provPosn.y);
            // unit shadow
            ctx.globalCompositeOperation = 'source-over';
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 2;
            // draw unit img
            const { newestUnit } = province;
            if (newestUnit) {
                const { unitPosn } = province;
                ctx.drawImage(await Canvas.loadImage(newestUnit.imageDir), unitPosn.x, unitPosn.y);
            }
            provctx.drawImage(canvas, 0, 0);
        }

        // === DRAW PROVINCE GLOW ===
        provctx.globalCompositeOperation = 'destination-over';
        provctx.shadowBlur = 30;
        for (let i = 0; i < this.provinces.length; i++) {
            const province = this.provinces[i];
            const provinceCountry = province.getCountry(this.countries);
            const provinceImg = await Canvas.loadImage(province.imageDir);
            provctx.shadowColor = provinceCountry ? provinceCountry.colour : 'white';
            const { provPosn } = province
            provctx.drawImage(provinceImg, provPosn.x, provPosn.y);
        }
        
        // === DRAW PROVINCE OUTLINES (labels + pr) + PROVINCES TO BACKGROUND ===
        bgctx.drawImage(await Canvas.loadImage('./dip/maps/standard/outline.png'), 0, 0);
        bgctx.drawImage(prov, 0, 0);
        
        return bg.toBuffer();
    }
}