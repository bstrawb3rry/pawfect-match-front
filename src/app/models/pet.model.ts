import { Owner } from "./owner.model";

export class Pet {
    id: number;
    name: string;
    owner: Owner; 
    breed: string;
    age: number;
    birthdate: Date;
    type: string;
    description: string;
    gender: string;
    color: string;
    photoIds: number[];
    distance: number;
  
    constructor(pet: Pet) {
      this.id = pet?.id;
      this.name = pet?.name;
      this.owner = pet?.owner;
      this.breed = pet?.breed;
      this.age = pet?.age;
      this.birthdate = pet?.birthdate;
      this.type = pet?.type;
      this.description = pet?.description;
      this.gender = pet?.gender;
      this.color = pet?.color;
      this.photoIds = pet?.photoIds;
      this.distance = pet?.distance;
    }
  }
  