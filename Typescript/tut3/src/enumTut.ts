enum Roles{
    admin= "admin",
    user= "user",
}
enum Gender{
    male="male",
    female="female",
    other="other"
}

type loginDetails = {
    email: string;
    password: string;
    role : Roles;
    gender : Gender;
}

const myuser1: loginDetails = {
    email: "hj123@gmail.com",
    password: "123456",
    role: Roles.admin,
    gender: Gender.female
}


// const myuser2: loginDetails = {
//     email: "vj@gmail.com",
//     password: "123456",
//     role: Roles.user,
//     gender: Gender.male
// }

console.log(myuser1);
// console.log(myuser2);