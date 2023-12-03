// let count:number = 10;
// count=12
// let message:string = "Hello World"
// let isDone:boolean = true
// let numbers:number[] = [1,2,3,4]
// let numbers2:Array<number> = [1,2,3,4]
// let fruits:Array<string> = ['Apple','Banana','Orange']
// let person:[string,number,boolean] = ['Chris',22,false]
// enum Color{
//     Red = 1,
//     Green = 2,
//     Blue = 3
// }
// let c:Color = 6
// let a:any = 10
// a = "Hello World"
// function myfunc():void{
//     console.log("Hello World")
// }
// let nullValue: null = null
// let undefinedValue: undefined = undefined
// let user: object = {
//     name: 'Chris',
//     age: 22
// }
// let someValue: any = "this is a string"
// let strlength: number = (someValue as string).length
// console.log(strlength)
// interface person{
//     name: string,
//     age: any,
//     address?: string
// }
// let user: person = {
//     name: 'Chris',
//     age: false
// }
// let unionType: string | number | boolean | number[] = 10
// unionType = "Hello World"
// unionType = true
// unionType = [1,2,3,4,5,6,7,8,9,10]
// interface A {
//     name: string
// }
// interface B {
//     age: number
// }
// let person: A & B = {
//     name: 'Chris',
//     age: 22,
//     gender: 'male'
// }
// NUMBERS OPERATIONS
// let sum:number = 10 + 10
// let difference: number = 10 - 4; // Result: 6
// let product: number = 10 * 4; // Result: 40
// let quotient: number = 10 / 5; // Result: 2\
// let remainder: number = 10 % 2; // Result: 0
// let x: number = 5;
// x++; // Increment x by 1
// let y: number = 10;
// y--; // Decrement y by 1
// let sqrtValue: number = Math.sqrt(25); // Result: 5
// let powerValue: number = Math.pow(2, 3); // Result: 8 (2 raised to the power of 3)
// let absValue: number = Math.abs(-10); // Result: 10
// let roundedValue: number = Math.round(3.7); // Result: 4
// let floorValue: number = Math.floor(4.9); // Result: 4
// let ceilValue: number = Math.ceil(3.2); // Result: 4
// let greater: boolean = 10 > 5; // Result: true
// let logicalAnd: boolean = (5 < 10) && (8 > 3); // Result: true
// let firstName: string = "John";
// let lastName: string = "Doe";
// let fullName: string = firstName + " " + lastName; // Result: "John Doe"
// let country: string = "USA";
// let message: string = `I live in ${country as string}.`; // Result: "I live in USA."
// let greeting: string = "Hello, World!";
// let length1: number = greeting.length; // Result: 13
// let text: string = "Example Text";
// let upperCaseText: string = text.toUpperCase(); // Result: "EXAMPLE TEXT"
// let lowerCaseText: string = text.toLowerCase(); // Result: "example text"
// let str: string = "Hello";
// let char: string = str.charAt(0); // Result: "H"
// let charCode: number = str.charCodeAt(1); // Result: Unicode value of 'e'
// let sentence: string = "The quick brown fox";
// let subString: string = sentence.substring(4, 9); // Result: "quick"
// let slicedString: string = sentence.slice(4, 9); // Result: "quick"
// let substrString: string = sentence.substr(10, 5); // Result: "brown"
// let phrase: string = "This is a test";
// let firstIndex: number = phrase.indexOf("is"); // Result: 2
// let lastIndex: number = phrase.lastIndexOf("is"); // Result: 5
// function infiniteLoop(): never {
//     while (true) {
//         // Perform operations
//     }
// }
// function throwError(message: string): never {
//     throw new Error(message);
// }
// let someValue: unknown = "12";
// let somenum: number = 0;
// // if (typeof someValue === "number") {
// //     somenum = someValue;
// // }
// // else if (typeof someValue === "string") {
// //     somenum = 100000;
// // }
// console.log(somenum)
// function add(a: number, b: number):number{
//     return a + b
// }
// function greet(name: string, age: number): string {
//     return `Hello, ${name}! You are ${age} years old.`;
// }
// function sayHello(name: string, greeting?: string):string{
//     // return `${greeting}, ${name}!`
//     if(greeting){
//         return `${greeting}, ${name}!`
//     }
//     else{
//         return `Hello, ${name}!`
//     }
// }
// let result = sayHello("Chris");
// console.log(result); // Result: "Good morning, Chris!"
// function sayMessage(message: string = 'Hello'): void {
//     console.log(message);
// }
// sayMessage('dafasfasfasfasf'); 
// type MathOperation = (a: number, b: number) => number;
// let add:MathOperation =(a,b)=>{
//     return a + b
// }
var numbers = [1, 2, 3, 4, 5];
var fruits = ['apple', 'banana', 'orange'];
var names = ['Alice', 'Bob', 'Charlie'];
var mixed = [1, 'Alice', 2, 'Bob'];
var person = [
    {
        name: 'Alice',
        age: 30
    },
    {
        name: 'Bob',
        age: '30'
    }
];
var readOnlyNumbers = [1, 2, 3, 4, 5];
var values = [1, 'Alice', true, 4, 5, 6];
var numbersOnly = values;
console.log(numbersOnly); // Result: [1, 4, 5,6]
