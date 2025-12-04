export interface UserSeedData {
  email: string;
  passwordHash: string;
  fullName: string;
}

export interface SkillSeedData {
  name: string;
  description: string;
}

export const defaultUsers: UserSeedData[] = [
  {
    email: 'john.doe@example.com',
    passwordHash: '$2b$10$hashedpassword1',
    fullName: 'John Doe',
  },
  {
    email: 'jane.smith@example.com',
    passwordHash: '$2b$10$hashedpassword2',
    fullName: 'Jane Smith',
  },
  {
    email: 'alex.johnson@example.com',
    passwordHash: '$2b$10$hashedpassword3',
    fullName: 'Alex Johnson',
  },
  {
    email: 'emily.brown@example.com',
    passwordHash: '$2b$10$hashedpassword4',
    fullName: 'Emily Brown',
  },
  {
    email: 'michael.wilson@example.com',
    passwordHash: '$2b$10$hashedpassword5',
    fullName: 'Michael Wilson',
  },
];

export const defaultSkills: SkillSeedData[] = [
  {
    name: 'JavaScript',
    description:
      'Modern JavaScript including ES6+ features and async programming',
  },
  {
    name: 'TypeScript',
    description:
      'Strongly typed superset of JavaScript for scalable applications',
  },
  {
    name: 'React',
    description:
      'Component-based UI library for building interactive interfaces',
  },
  {
    name: 'Node.js',
    description: 'Server-side JavaScript runtime for backend development',
  },
  {
    name: 'Python',
    description:
      'Versatile programming language for web, data science and automation',
  },
  {
    name: 'SQL',
    description: 'Database query language for relational databases',
  },
  {
    name: 'Docker',
    description:
      'Containerization platform for consistent deployment environments',
  },
  {
    name: 'Git',
    description: 'Version control system for collaborative development',
  },
];
