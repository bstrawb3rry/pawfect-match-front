export class Owner {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  
    constructor(owner: Owner) {
      this.id = owner?.id;
      this.firstName = owner?.firstName;
      this.lastName = owner?.lastName;
      this.email = owner?.email;
    }
  }
  