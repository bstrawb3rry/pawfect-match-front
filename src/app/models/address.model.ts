export class Address {
    id: number;
    country: string;
    county: string;
    city: string;
    postalCode: number;
    address: string;
  
    constructor(address: Address) {
      this.id = address?.id;
      this.country = address?.country;
      this.county = address?.county;
      this.city = address?.city;
      this.postalCode = address?.postalCode;
      this.address = address?.address;
    }
  }