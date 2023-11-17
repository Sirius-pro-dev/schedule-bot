export const formatGroupInfo = (group) => {
  return `
Группа: ${group.name}
Направление: ${group.major}
Курс: ${group.course}
Форма обучения: ${group.studyForm}
Уровень образования: ${group.educationLevel}
`;
};

export const formatTeacherInfo = (teacher) => {
  return `
Username: ${teacher.userName}
Имя: ${teacher.name}
Фамилия: ${teacher.lastName}
Отчество: ${teacher.surName}
Роль: ${teacher.role}
`;
};
