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
            firstName: firstName ? firstName : faker.name.firstName(),
            lastName: lastName ? lastName : faker.name.lastName(),
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
    }
}