import axios from 'axios';
import { formatTeacherInfo } from '../../utils/formatsData.js';

export const getAllTeachers = async (ctx) => {
  try {
    const response = await axios.get('http://212.193.62.200:3007/api/user/getTeacherOrGroup?tab=преподаватель');

    const teachers = response.data;

    const formattedGroups = teachers.map((teacher) => {
      return formatTeacherInfo(teacher);
    });

    const formattedResponse = formattedGroups.join('\n');

    ctx.replyWithHTML(`<code>${formattedResponse.slice(0, 4000)}</code>`);
  } catch (error) {
    console.error('Ошибка при получении данных из API:', error);

    if (error.response) {
      const status = error.response.status;

      if (status === 400) {
        ctx.replyWithMarkdown('*Ошибка*: Указаны не существующие типы.');
      } else if (status === 404) {
        ctx.replyWithMarkdown('*Ошибка*: Пользователи/группы не найдены.');
      } else {
        ctx.replyWithMarkdown(`*Ошибка при получении данных из API:*\n\`${error.message}\``);
      }
    } else {
      ctx.replyWithMarkdown(`*Ошибка при получении данных из API:*\n\`${error.message}\``);
    }
  }
};
