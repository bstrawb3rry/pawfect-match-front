export class Owner {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
  
    constructor(owner: Owner) {
      this.id = owner?.id;
      this.firstName = owner?.firstName;
      this.lastName = owner?.lastName;
      this.email = owner?.email;
      this.address = owner?.address;
    }
  }
  