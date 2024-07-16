export class CountryInformation {
    geonameId: string;
    countryName: string;
    countryCode: string;
  
    constructor(countryInformation: CountryInformation) {
      this.geonameId = countryInformation?.geonameId;
      this.countryName = countryInformation?.countryName;
      this.countryCode = countryInformation?.countryCode;
    }
  }