import { User } from "../core";

const list: User[] = [];

export class Register {
  async execute(i: User) {
    console.log(`Searching: ${i.email}`);
    const fu = list.find((fi) => {
      const truem = fi.email === i.email;
      return truem
    });
    if (!fu) {

      if (i.name && i.email) {
        list.push(i);
        console.log(`Sent Email`);
        return i;
      } else return null

    } else
      return null
    
  }
}
