export interface UserSeedData {
  email: string;
  passwordHash: string;
  fullName: string;
}

export interface SkillSeedData {
  name: string;
  description: string;
}

export const ukrainianUsers: UserSeedData[] = [
  {
    email: 'taras.shevchenko@example.com',
    passwordHash: '$2b$10$hashedpassword1',
    fullName: 'Тарас Шевченко',
  },
  {
    email: 'lesya.ukrainka@example.com',
    passwordHash: '$2b$10$hashedpassword2',
    fullName: 'Леся Українка',
  },
  {
    email: 'ivan.franko@example.com',
    passwordHash: '$2b$10$hashedpassword3',
    fullName: 'Іван Франко',
  },
  {
    email: 'hryhoriy.skovoroda@example.com',
    passwordHash: '$2b$10$hashedpassword4',
    fullName: 'Григорій Сковорода',
  },
  {
    email: 'olena.pchilka@example.com',
    passwordHash: '$2b$10$hashedpassword5',
    fullName: 'Олена Пчілка',
  },
];

export const ukrainianSkills: SkillSeedData[] = [
  {
    name: 'Українська мова',
    description: 'Навчання української мови, граматики та літератури',
  },
  {
    name: 'Вишивка',
    description: 'Традиційна українська вишивка хрестиком та гладдю',
  },
  {
    name: 'Кобзарство',
    description: 'Гра на бандурі та кобзі, українські народні пісні',
  },
  {
    name: 'Петриківський розпис',
    description: 'Декоративний народний розпис з Петриківки',
  },
  {
    name: 'Писанкарство',
    description: 'Традиційне розмальовування великодніх яєць',
  },
  {
    name: 'Програмування',
    description: 'Розробка програмного забезпечення та веб-додатків',
  },
  {
    name: 'Веб-дизайн',
    description: 'Створення сучасних веб-інтерфейсів та UX/UI',
  },
  {
    name: 'Фотографія',
    description: 'Професійна та аматорська фотозйомка',
  },
];
