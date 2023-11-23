import axios from 'axios';
import { formatScheduleInfo, formatWeekInfo } from '../../utils/formatsData.js';
import { WizardScene } from 'telegraf/scenes';

export const getAllSchedule = async (ctx) => {
  try {
    const response = await axios.get('http://212.193.62.200:3007/api/schedule');

    const schedule = response.data;

    const formattedGroups = schedule.map((schedule) => {
      return formatScheduleInfo(schedule);
    });

    const formattedResponse = formattedGroups.join('\n');

    ctx.replyWithHTML(`<code>${formattedResponse.slice(0, 4000)}</code>`);
  } catch (error) {
    console.error('Ошибка при получении данных:', error);

    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        ctx.replyWithMarkdown('*Ошибка*: Не указано обязательное поле название группы.');
      } else {
        ctx.replyWithMarkdown(`*Ошибка при получении данных:*\n\`${error.message}\``);
      }
    } else {
      ctx.replyWithMarkdown(`*Ошибка при получении данных:*\n\`${error.message}\``);
    }
  }
};

export const getNeedSchedule = new WizardScene(
  'getNeedSchedule',
  async (ctx) => {
    await ctx.reply('Введите id расписания:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.id = ctx.message.text;

    try {
      const response = await axios.get(`http://212.193.62.200:3007/api/schedule/${ctx.session.id}`);

      const schedule = response.data;
      const formattedInfo = formatScheduleInfo(schedule);

      ctx.replyWithHTML(`<code>${formattedInfo.slice(0, 4000)}</code>`);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);

      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          ctx.replyWithMarkdown('*Ошибка*: Не указан id расписания.');
        } else if (status === 404) {
          ctx.replyWithMarkdown('*Ошибка*: Расписание не найдено либо не существует.');
        } else {
          ctx.replyWithMarkdown(`*Ошибка при получении данных:*\n\`${error.message}\``);
        }
      } else {
        ctx.replyWithMarkdown(`*Ошибка при получении данных:*\n\`${error.message}\``);
      }
    }

    return ctx.scene.leave();
  }
);

export const getNeedScheduleForWeek = new WizardScene(
  'getNeedScheduleForWeek',
  async (ctx) => {
    await ctx.reply('Введите номер недели:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.week = ctx.message.text;

    try {
      const response = await axios.get(`http://212.193.62.200:3007/api/schedule/week/${ctx.session.week}`);

      const schedule = response.data;

      const formattedInfo = formatWeekInfo(schedule);

      ctx.replyWithHTML(`<code>${formattedInfo.slice(0, 4000)}</code>`);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);

      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          ctx.replyWithMarkdown('*Ошибка*: Не указана неделея.');
        } else if (status === 404) {
          ctx.replyWithMarkdown('*Ошибка*: Расписание не найдено либо не существует.');
        } else {
          ctx.replyWithMarkdown(`*Ошибка при получении данных:*\n\`${error.message}\``);
        }
      } else {
        ctx.replyWithMarkdown(`*Ошибка при получении данных:*\n\`${error.message}\``);
      }
    }

    return ctx.scene.leave();
  }
);

export const createSchedule = new WizardScene(
  'createSchedule',
  async (ctx) => {
    await ctx.reply('Введите дату(в формате YYYY-MM-DD:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.date = ctx.message.text;

    await ctx.reply('Введите время(в диапазоне 1.5 часа, например 09:00-10:30):');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.time = ctx.message.text;

    await ctx.reply('Введите название предмета:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.disciplineName = ctx.message.text;

    await ctx.reply('Введите тип занятия(Лекция, Семинар и т.д.):');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.classType = ctx.message.text;

    await ctx.reply('Введите преподавателя:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.teacher = ctx.message.text;

    await ctx.reply('Введите группу:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.group = ctx.message.text;

    await ctx.reply('Введите адрес:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.locationAddress = ctx.message.text;

    await ctx.reply('Введите номер аудитории:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.classRoom = ctx.message.text;

    try {
      const response = await axios.post('http://212.193.62.200:3007/api/schedule/create', {
        date: ctx.session.date,
        time: ctx.session.time,
        disciplineName: ctx.session.disciplineName,
        classType: ctx.session.classType,
        teacher: ctx.session.teacher,
        group: ctx.session.group,
        locationAddress: ctx.session.locationAddress,
        classRoom: ctx.session.classRoom
      });

      const schedule = response.data;
      const formattedInfo = formatScheduleInfo(schedule);

      ctx.replyWithHTML(`<code>Расписание успешно создано!\n${formattedInfo.slice(0, 4000)}</code>`);
    } catch (error) {
      console.error('Ошибка при создании расписания:', error);

      if (error.response) {
        console.log(error.response);
        const status = error.response.status;
        const responseData = error.response.data;

        if (status === 400 && responseData.error) {
          ctx.replyWithMarkdown(`*Ошибка валидации*: ${responseData.error.detail}`);
        } else if (status === 404 && responseData.error) {
          ctx.replyWithMarkdown(`*Ошибка*: ${responseData.error.detail}`);
        } else {
          ctx.replyWithMarkdown(`*Ошибка при создании группы:*\n\`${error.message}\``);
        }
      } else {
        ctx.replyWithMarkdown(`*Ошибка при создании расписания:*\n\`${error.message}\``);
      }
    }

    return ctx.scene.leave();
  }
);

export const deleteSchedule = new WizardScene(
  'deleteSchedule',
  async (ctx) => {
    await ctx.reply('Введите id расписания:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.id = ctx.message.text;

    try {
      const response = await axios.delete('http://212.193.62.200:3007/api/schedule/delete', {
        data: { id: ctx.session.id }
      });

      const scheduleInfo = response.data;
      const formattedInfo = formatScheduleInfo(scheduleInfo);

      ctx.replyWithHTML(`<code>Успешно удалено расписание:\n${formattedInfo}</code>`);
    } catch (error) {
      console.log('Ошибка при удалении расписания:', error);

      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;

        if (status === 400 && responseData.error) {
          ctx.replyWithMarkdown(`*Ошибка*: ${responseData.error.detail}`);
        } else if (status === 404 && responseData.error) {
          ctx.replyWithMarkdown(`*Ошибка*: ${responseData.error.detail}.`);
        } else {
          ctx.replyWithMarkdown(`*Ошибка при удалении расписания:*\n\`${error.message}\``);
        }
      } else {
        ctx.replyWithMarkdown(`*Ошибка при удалении расписания:*\n\`${error.message}\``);
      }
    }

    return ctx.scene.leave();
  }
);
