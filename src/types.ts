type User = {
  username: string;
  password: string;
  image?: string;
};

type Person = {
  name: string;
  phone?: string;
  email: string;
  work_hours?: JSON;
  institution?: string;
};

type login = {
  username: string;
  password: string;
};
export { User, Person, login };
