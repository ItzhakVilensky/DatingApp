import { User } from "./user";

// Headers to attach to HTTP request
export class UserParams {
    gender: string;
    minAge = 18;
    maxAge = 99;
    pageNumber = 1;
    pageSize = 5;
    orderBy = 'lastActive';

    constructor(user: User) {
        // if user is male display on page only females
        this.gender = user.gender === 'female' ? 'male' : 'female';
    }
}