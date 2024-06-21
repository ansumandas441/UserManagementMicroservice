export interface UserModel {
    id: number;
    name: string;
    surname: string;
    username: string;
    birthdate: Date;
    blockedContacts?: number[];
  }
  