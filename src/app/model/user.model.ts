export class User {
    id: number;
    emailId: string;
    firstName: string;
    username : string;
    access : string;

    constructor() {
        {
          this.id = 0;
          this.emailId = '';
          this.firstName = '';
          this.username = '';
          this.access = '';
        }
    }
}