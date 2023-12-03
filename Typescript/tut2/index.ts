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



// let numbers: number[] = [1, 2, 3, 4, 5  ];
// let fruits: string[] = ['apple', 'banana', 'orange'];
// let names: Array<string> = ['Alice', 'Bob', 'Charlie'];
// let mixed: (string | number)[] = [1, 'Alice', 2, 'Bob'];

// interface Person {
//     name: string;
//     age: number|string;
// }

// let person: Person[] = [
//     {
//         name: 'Alice',
//         age: 30
//     },
//     {
//         name: 'Bob',
//         age: '30'
//     }
// ]


// let readOnlyNumbers: ReadonlyArray<number> = [1, 2, 3, 4, 5];

// let numbers: number[] = [1, 2, 3];
// numbers.push(4, 5); // Result: [1, 2, 3, 4, 5]


// let fruits: string[] = ['apple', 'banana', 'orange'];
// fruits.pop(); // Result: ['apple', 'banana']


// let colors: string[] = ['red', 'green', 'blue'];
// let firstColor: any = colors.shift(); // Result: 'red'


// let animals: string[] = ['dog', 'cat'];
// animals.unshift('horse', 'rabbit'); // Result: ['horse', 'rabbit', 'dog', 'cat']



// let arr1: number[] = [1, 2];
// let arr2: number[] = [3, 4];
// let combinedArray: number[] = arr1.concat(arr2); // Result: [1, 2, 3, 4]


// let months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
// let slicedMonths: string[] = months.slice(1, 4); // Result: ['Feb', 'Mar', 'Apr']


// let cars: string[] = ['Toyota', 'Honda', 'Ford'];
// cars.splice(1, 0, 'Chevrolet', 'BMW'); // Result: ['Toyota', 'Chevrolet', 'BMW', 'Honda', 'Ford']


// let numbers: number[] = [10, 20, 30, 40, 50];
// let index: number = numbers.indexOf(30); // Result: 2

// let colors: string[] = ['red', 'green', 'blue'];
// colors.forEach(color => console.log(color));
// // Output:
// // red
// // green
// // blue


// let numbers: number[] = [1, 2, 3];
// let doubledNumbers: number[] = numbers.map(num => num * 2); // Result: [2, 4, 6]


// Object with specified property types
// let user: { name: string, age: number, email?:string } = {
//     name: 'Alice',
//     age: 30,
//     email: 'viraj@gmail.com'
// };


// type Person = {
//     name: string;
//     age: number;
// };


// let user: Person = {
//     name: 'Alice',
//     age: 30
// };

type Point = {
    readonly x: number;
    readonly y: number;
};
let point: Point = { x: 10, y: 20 };



type Address = {
    street: string;
    city: string;
};

type User = {
    name: string;
    age: number;
    address: Address; // Nested object type
};

let userDetails: User = {
    name: 'Charlie',
    age: 28,
    address: {
        street: '123 Main St',
        city: 'Anytown'
    }
};


let person: { name: string, age: number } = {
    name: 'Alice',
    age: 30
};

console.log(person.name); // Accessing property 'name'


let readOnlyUser: Readonly<{ name: string, age: number }> = {
    name: 'Alice',
    age: 30
};

// readOnlyUser.name = 'Bob'; // Error: Cannot assign to 'name' because it is a read-only property
