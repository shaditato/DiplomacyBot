require('dotenv').config({path: __dirname + '/.env'});


const Engine = require('./engine.js');
const { dUnit, dPosition, dProvince, dOrder, dTurn, dGame } = Engine.classes;
const { unitTypes, orderTypes, provinceTypes, turnPhases } = Engine;
const { Game1 } = require('./maps/standard/standard.js');
const Canvas = require('canvas')

const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = process.env['BOT_PREFIX'];

client.on('ready', () => {
    console.log('client is online')
});

client.on('message', async (m) => {
    let handleCatch = function(e) {
        console.error(e);
    }
    let reply = function(content, files) {
        if (!files) {
            return m.channel.send(content)
                .catch(handleCatch);
        } else {
            return m.channel.send(content, { files: files })
                .catch(handleCatch);
        }
        
    }
    let fromOwner = function() {
        return (m.author.id == process.env['BOT_ADMIN_ID']);
    }

    if (!m.content.toLowerCase().startsWith(prefix) || m.author.bot) return;

    const args = m.content.toLowerCase().slice(prefix.length).split(/ +/);
    const command = args.shift();

    switch (command) {
        case "exit":
            reply('goodbye')
            .then(() => {
                client.destroy();
                process.exit();
            })
            break;   
        case "ping":
            reply('ok');
            break;
        case "game":
            console.log(Game1);
            reply('console logged Game1')
            break;
        case "start":
            Game1.start(1901, turnPhases.order);
            reply('game started');
            break;
        case "order":
            let orderStr = m.content.slice(prefix.length + command.length + 1);
            let order = Game1.makeOrderFromString(orderStr);
            if (typeof order == 'string') reply(`Error: ${order}`);
            else {
                Game1.turn.addOrders(order);
                console.log(order);
                reply('console logged order');
            }
            break;
        case "next":
            Game1.nextTurn();
            reply('ok i tried');
            break;
        case "map":
            reply(Game1.getTime(), [await Game1.drawCanvas()]);
            break;
        case "eval":
            if (fromOwner()){
                try { 
                    let evalRes = eval(m.content.slice(prefix.length + command.length + 1));
                    if (!evalRes) reply('void');
                    else reply(evalRes.toString());
                } catch (e) {
                    reply('`'+e+'`');
                }
            }
            else reply('owner only');
            break;
    }
})

client.login(process.env['BOT_TOKEN'])