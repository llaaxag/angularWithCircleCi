export class Company {
    name = '';
    catchPhrase = '';
}

export class User {
    name = '';
    id = 0;
    email = '';
    company: Company;
    constructor() {}
}

export class SuperUser extends User {
    power = 'strength';
    alias = 'Superman';
}
