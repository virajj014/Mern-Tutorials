"use strict";
var Roles;
(function (Roles) {
    Roles["admin"] = "admin";
    Roles["user"] = "user";
})(Roles || (Roles = {}));
var Gender;
(function (Gender) {
    Gender["male"] = "male";
    Gender["female"] = "female";
    Gender["other"] = "other";
})(Gender || (Gender = {}));
const myuser1 = {
    email: "hj123@gmail.com",
    password: "123456",
    role: Roles.admin,
    gender: Gender.female
};
// const myuser2: loginDetails = {
//     email: "vj@gmail.com",
//     password: "123456",
//     role: Roles.user,
//     gender: Gender.male
// }
console.log(myuser1);
// console.log(myuser2);
