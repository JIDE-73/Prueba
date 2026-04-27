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
  role: "Estudiante" | "Tutor" | "Administrador";
};

type login = {
  username: string;
  password: string;
};

type Course = {
  placeId: number;
  tutorId: number;
  name: string;
  period: string;
};

export { User, Person, login, Course };
