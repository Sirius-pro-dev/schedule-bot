import 'dotenv/config';
import { session, Telegraf } from 'telegraf';
import { createGroup, deleteGroup, getAllGroupCommand, getNeedGroup } from './scenes/groups/index.js';
import { commands, description } from './const/index.js';
import { Stage } from 'telegraf/scenes';
import { getAllTeachers } from './scenes/users/index.js';

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

bot.use(Telegraf.log());
bot.telegram.setMyCommands(commands);

bot.start(async (ctx) => {
  return await ctx.reply(
    `Привет, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'друг'}! ${description}`
  );
});

const { enter } = Stage;
const stage = new Stage([getNeedGroup, createGroup, deleteGroup]);

bot.use(session());
bot.use(stage.middleware());

bot.command('all_groups', getAllGroupCommand);
bot.command('need_group', enter('getNeedGroup'));
bot.command('teachers', getAllTeachers);
bot.command('create_group', enter('createGroup'));
bot.command('delete_group', enter('deleteGroup'));

bot.launch();

bot.on('text', (ctx) => {
  const userMessage = ctx.message.text;
  ctx.reply(`Извините, неизвестная команда: ${userMessage}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
