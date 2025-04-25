// user data
const users = [
  {
    name: 'topall',
    email: 'topall@example.in',
    password: 'password',
    image: '/images/users/user-1.jpg'
  }
];

export type User = (typeof users)[number];

export const getUserByEmail = (email: string) => {
  return users.find((user) => user.email === email);
};
