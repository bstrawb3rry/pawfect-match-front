import { Address } from "./address.model";
import { Owner } from "./owner.model";

export class User {
    id: number;
    username: string;
    password: string;
    enabled: boolean;
    petOwner: Owner;
    address: Address;
  
    constructor(user: User) {
      this.id = user?.id;
      this.username = user?.username;
      this.password = user?.password;
      this.enabled = user?.enabled;
      this.petOwner = user?.petOwner;
      this.address = user?.address;
    }
  }