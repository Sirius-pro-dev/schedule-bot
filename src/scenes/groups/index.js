import axios from 'axios';
import { WizardScene } from 'telegraf/scenes';
import { formatGroupInfo } from '../../utils/formatsData.js';

export const getAllGroupCommand = async (ctx) => {
  try {
    const response = await axios.get('http://212.193.62.200:3007/api/group');

    const groups = response.data;

    const formattedGroups = groups.map((group) => {
      return formatGroupInfo(group);
    });

    const formattedResponse = formattedGroups.join('\n');

    ctx.replyWithHTML(`<code>${formattedResponse.slice(0, 4000)}</code>`);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      ctx.replyWithMarkdown('*Ошибка*: Не найдены группы.');
    } else {
      ctx.replyWithMarkdown(`*Ошибка при получении данных:*\n\`${error.message}\``);
    }
  }
};

export const getNeedGroup = new WizardScene(
  'getNeedGroup',
  async (ctx) => {
    await ctx.reply('Введите название группы:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.name = ctx.message.text;

    try {
      const response = await axios.get(`http://212.193.62.200:3007/api/group/${ctx.session.name}`);

      const groupInfo = response.data;
      const formattedInfo = formatGroupInfo(groupInfo);

      ctx.replyWithHTML(`<code>${formattedInfo.slice(0, 4000)}</code>`);
    } catch (error) {
      console.error('Ошибка при получении данных  :', error);

      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          ctx.replyWithMarkdown('*Ошибка*: Не указано обязательное поле название группы.');
        } else if (status === 404) {
          ctx.replyWithMarkdown('*Ошибка*: Название группы не найдено либо не существует.');
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

export const createGroup = new WizardScene(
  'createGroup',
  async (ctx) => {
    await ctx.reply('Введите код группы:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.code = ctx.message.text;

    await ctx.reply('Введите название направления:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.major = ctx.message.text;

    await ctx.reply('Введите курс:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.course = ctx.message.text;

    await ctx.reply('Введите форму обучения (очная/заочная):');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.studyForm = ctx.message.text;

    await ctx.reply('Введите уровень обучения (СПО/ВУЗ и т.д.):');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.educationLevel = ctx.message.text;

    try {
      const response = await axios.post('http://212.193.62.200:3007/api/group/create', {
        name: ctx.session.code,
        major: ctx.session.major,
        course: ctx.session.course,
        studyForm: ctx.session.studyForm,
        educationLevel: ctx.session.educationLevel,
        users: []
      });

      const groupInfo = response.data;
      const formattedInfo = formatGroupInfo(groupInfo);

      ctx.replyWithHTML(`<code>Группа успешно создана!\n${formattedInfo.slice(0, 4000)}</code>`);
    } catch (error) {
      console.error('Ошибка при создании группы:', error);

      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          ctx.replyWithMarkdown('*Ошибка*: Указаны не все обязательные поля для создания группы.');
        } else if (status === 404) {
          ctx.replyWithMarkdown('*Ошибка*: Не найден пользователь.');
        } else {
          ctx.replyWithMarkdown(`*Ошибка при создании группы:*\n\`${error.message}\``);
        }
      } else {
        ctx.replyWithMarkdown(`*Ошибка при создании группы:*\n\`${error.message}\``);
      }
    }

    return ctx.scene.leave();
  }
);

export const deleteGroup = new WizardScene(
  'deleteGroup',
  async (ctx) => {
    await ctx.reply('Введите название группы:');
    return ctx.wizard.next();
  },
  async (ctx) => {
    ctx.session.name = ctx.message.text;

    try {
      const response = await axios.delete('http://212.193.62.200:3007/api/group/delete', {
        data: { name: ctx.session.name }
      });

      const groupInfo = response.data;
      const formattedInfo = formatGroupInfo(groupInfo);

      ctx.replyWithHTML(`<code>Успешно удалена группа:\n${formattedInfo.slice(0, 4000)}</code>`);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);

      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          ctx.replyWithMarkdown('*Ошибка*: Не указано обязательное поле название группы.');
        } else if (status === 404) {
          ctx.replyWithMarkdown('*Ошибка*: Название группы не найдено либо не существует.');
        } else {
          ctx.replyWithMarkdown(`*Ошибка при получении данных:*\n\`${error.message}\``);
        }
      } else {
        ctx.replyWithMarkdown(`*Ошибка при удалении группы:*\n\`${error.message}\``);
      }
    }

    return ctx.scene.leave();
  }
);
