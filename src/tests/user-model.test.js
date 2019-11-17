import { expect } from "chai";
const UserModel = require("../models/user.model");
describe("User model should validate properly", () => {
    describe("#validate", () => {
        it("should return errors if invalided fields exist", () => {
            let user = new UserModel({
                email: "chienbm62",
                fullName: "",
                salted: "7nWZLcCK0vsPzIM",
                hashed: "0510210d4b370165658bdc0d0b005244"
            });
            user.validate(err => {
                expect(err.errors.email).to.exist;
                expect(err.errors.email.message).equal(
                    "chienbm62 is not a valid email!"
                );
                expect(err.errors.fullName).to.exist;
                expect(err.errors.fullName.message).equal(
                    "Fullname is required!"
                );
            });
        });
        it("should pass all validator", () => {
            let user = new UserModel({
                email: "chienbm62@gmail.com",
                fullName: "Bui Minh Chien",
                salted: "7nWZLcCK0vsPzIM",
                hashed: "0510210d4b370165658bdc0d0b005244"
            });
            user.validate(err => {
                expect(err).to.not.exist;
            });
        });
    });
});
