const TelegramApi = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options')
const token = '2115298478:AAHKBLRsI_aVAwDaWMbONfh8MWB0Gs0vIVI';

const bot = new TelegramApi(token, { polling: true });

const chats = {};
console.log(chats);

const startGame = async (chatId) => {
	await bot.sendMessage(chatId, 'Try to guess a number from 0 to 9');
	const randomNumber = Math.floor(Math.random() * 10);
	chats[chatId] = randomNumber;
	await bot.sendMessage(chatId, "let's try guess", gameOptions);
}

const start = () => {
	bot.setMyCommands([
		{ command: '/start', description: 'initial greeting' },
		{ command: '/info', description: "Get user's information" },
		{ command: '/game', description: "The game" }
	])

	bot.on('message', async msg => {
		const text = msg.text;
		const chatId = msg.chat.id;

		if (text === '/start') {
			await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/304/c4c/304c4c53-263b-4bee-a9d6-6d89ee579114/6.jpg');
			return bot.sendMessage(chatId, `Welcome to telegram chanel by Serg_Mo`);
		}
		if (text === '/info') {
			return bot.sendMessage(chatId, `Your name is ${msg.from.username}`);
		}
		if (text === '/game') {
			return startGame(chatId);
		}
		return bot.sendMessage(chatId, 'Please try again');
	});

	bot.on('callback_query', async msg => {
		const data = msg.data;
		const chatId = msg.message.chat.id;
		if (data === '/again') {
			return startGame(chatId);
		}
		if (data === chats[chatId]) {
			return bot.sendMessage(chatId, `You win it is ${chats[chatId]}`, againOptions);
		} else {
			return bot.sendMessage(chatId, `You lose it is ${chats[chatId]}`, againOptions);
		}
	})
}

start();
console.log(chats);
