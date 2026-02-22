import { Gender, UserRole } from "../generated/enums";

export const users = [
  {
    firstName: "Emdadul Hoque",
    lastName: "Emon",
    email: "fb1@example.com",
    phone: "+8801787286529",
    username: "emon",
    password: "123456",
    role: UserRole.USER,
    gender: Gender.MALE,
    twoFactor: {
      active: false,
      secret: null,
    },
  },
  {
    firstName: "Bayjid",
    lastName: "Afride",
    email: "fb2@example.com",
    phone: "+8801787286530",
    username: "bayjid",
    password: "123456",
    role: UserRole.USER,
    gender: Gender.MALE,
    twoFactor: {
      active: false,
      secret: null,
    },
  },
  {
    firstName: "Nasim",
    lastName: "Khan",
    email: "fb3@example.com",
    phone: "+8801787286531",
    username: "nasim",
    password: "123456",
    role: UserRole.USER,
    gender: Gender.MALE,
    twoFactor: {
      active: false,
      secret: null,
    },
  },
  {
    firstName: "Mehedi",
    lastName: "Hasan",
    email: "fb4@example.com",
    phone: "+8801787286532",
    username: "mehedi",
    password: "123456",
    role: UserRole.USER,
    gender: Gender.MALE,
    twoFactor: {
      active: false,
      secret: null,
    },
  },
];
