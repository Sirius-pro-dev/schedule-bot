export const formatGroupInfo = (group) => {
  const studentsInfo =
    group.users.length > 0
      ? `Студенты: ${group.users.map((student) => `${student.name} ${student.lastName} ${student.surName}`).join(', ')}`
      : '';

  return `Группа: ${group.name}
Направление: ${group.major}
Курс: ${group.course}
Форма обучения: ${group.studyForm}
Уровень образования: ${group.educationLevel}
${studentsInfo}
`;
};

export const formatTeacherInfo = (teacher) => {
  return `Username: ${teacher.userName}
Имя: ${teacher.name}
Фамилия: ${teacher.lastName}
Отчество: ${teacher.surName}
Роль: ${teacher.role}
`;
};

export const formatScheduleInfo = (schedule) => {
  return `ID: ${schedule._id}
Дата: ${schedule.date}
Время: ${schedule.time}
Дисциплина: ${schedule.disciplineName}
Форма занятия: ${schedule.classType}
Локация: ${schedule.locationAddress}
Аудитория: ${schedule.classRoom}
Группа: ${schedule.group.name}
Курс: ${schedule.group.course}
`;
};

export const formatWeekInfo = (schedule) => {
  let formattedText = '';

  for (const dayNumber in schedule) {
    if (dayNumber === 'weekData') {
      const { month, year, week } = schedule[dayNumber];
      formattedText += `График на неделю ${week}, ${month} ${year}\n\n`;
    } else {
      const dayData = schedule[dayNumber];
      const { date, day, lessons } = dayData;

      formattedText += `${day}, ${date}:\n`;

      lessons.forEach((lesson) => {
        const { time, name, classType, classRoom, placeActivity, teacher, group } = lesson;
        formattedText += `${time} - ${name} (${classType}, ауд.${classRoom}, ${placeActivity}, ${teacher}, группа ${group.name})\n`;
      });

      formattedText += '\n';
    }
  }

  return formattedText;
};
