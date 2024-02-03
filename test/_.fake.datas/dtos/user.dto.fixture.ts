import { PostSignInDto } from "@dtos/auths/post.sign.in.dto";
import { PostSignUpDto } from "@dtos/auths/post.sign.up.dto";
import { faker } from "@faker-js/faker";

export class UserDtoFixture {

    public signUp(
        email?: string,
        password?: string,
        passwordCheck?: string,
        firstName?: string,
        lastName?: string
    ): PostSignUpDto {

        const fakePassword = this.generateRandomPassword;
        return {
            email: email ? email : this.generateRandomEmail,
            firstName: firstName ? firstName : this.generateRandomFirstName,
            lastName: lastName ? lastName : this.generateRandomLastName,
            password: password ? password : fakePassword,
            passwordCheck: passwordCheck ? passwordCheck : fakePassword
        }
    };

    public signIn(
        email?: string,
        password?: string
    ): PostSignInDto {

        const fakePassword = this.generateRandomPassword;

        return {
            email: email ? email : this.generateRandomEmail,
            password: password ? password : fakePassword
        }
    }

    get generateRandomEmail() {
        const randomString = Math.random().toString(36).substring(2, 10);
        const emailDomain = ['gmail.com', 'naver.com'];

        const randomDomainIndex = Math.floor(Math.random() * emailDomain.length);
        const randomDomain = emailDomain[randomDomainIndex];

        const randomEmail = `${randomString}@${randomDomain}`;
        return randomEmail;
    };

    get generateRandomPassword() {
        return faker.random.alphaNumeric(8);
    };

    get generateRandomNumber() {
        return faker.datatype.number();
    };

    get generateRandomFirstName() {
        return faker.name.firstName();
    };

    get generateRandomLastName() {
        return faker.name.lastName();
    };
}