"use strict";
// class Person {
//     // Properties
//     firstName: string;
//     lastName: string;
//     age: number;
//     // Constructor
//     constructor(firstName: string, lastName: string, age: number) {
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.age = age;
//     }
//     // Methods
//     getFullName(): string {
//         return `${this.firstName} ${this.lastName}`;
//     }
// }
// let person1 = new Person("HJ", "Singh", 21);
// console.log(person1.getFullName());
// class Animal {
//     name: string;
//     constructor(name: string) {
//         this.name = name;
//     }
//     makeSound(): void {
//         console.log("Generic Animal Sound");
//     }
// }
// class Dog extends Animal {
//     breed: string;
//     constructor(name: string, breed: string) {
//         super(name);
//         this.breed = breed;
//     }
//     getDetails(): void {
//         console.log(`Name: ${this.name} Breed: ${this.breed}`);
//     }
// }
// let dog1 = new Dog("Tommy", "Pug");
// let Animal1 = new Animal("abc");
// Animal1.makeSound();
// class MyClass {
//     private secret: string;
//     constructor(secret: string) {
//         this.secret = secret;
//     }
//     revealSecret(): void {
//         console.log(`the secret is ${this.secret}`);
//     }
// }
// let myObj = new MyClass("fasfagasfasfgasd");
// // console.log(myObj.secret);
// myObj.revealSecret();
// class Parent{
//     protected familyName: string;
//     constructor(familyName: string){
//         this.familyName = familyName;
//     }
// }
// class Child extends Parent{
//     public getFamilyName(): void{
//         console.log(`Family Name is ${this.familyName}`);
//     }
// }
// let child1 = new Child("Singh");
// // console.log(child1.familyName);
// child1.getFamilyName();
class Circle {
    constructor(radius) {
        this.radius = radius;
    }
    get diameter() {
        return this.radius * 2;
    }
    get getRadius() {
        return this.radius;
    }
    set setRadius(radius) {
        if (radius <= 0) {
            throw new Error("Radius should be greater than 0");
        }
        this.radius = radius;
    }
}
let circle1 = new Circle(10);
console.log(circle1.getRadius);
circle1.setRadius = 0;
console.log(circle1.getRadius);
