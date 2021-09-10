/* Required Packages */
require('dotenv').config();

/* Constants */
const tmi = require('tmi.js');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
    so: {
        response: (argument) => 'Shoutout to ${context.${arguement}}! Go and share some love by giving a like and follow!'
    },
    
}

/* Creates the client connection */
const client = new tmi.Client({
    /* Attempts Reconnect */
    connection: {
        reconnect: true
    },
    /* Channel Name */
    channels: [
        'ArcPlaysGames'
    ],
    /* Twitch Identity */
    indentity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_OAUTH_TOKEN
    }
});

client.connect();

/* Listens for new chat messages */
client.on('message', async (channel, context, message) => {

    const isNotBot = context.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME.toLowerCase();

    if ( !isNotBot ) return;

    const [raw, command, arguement] = message.match(regexpCommand);

    const { response } = commands[command] || {};

    let responseMessage = response;

    if ( typeof responseMessage === 'function' ) {
        responseMessage = response(argument);
    }

    if ( responseMessage ) {
        console.log('Responding to command !${command}');
        client.say(channel, responseMessage);
    }
});