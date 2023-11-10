import React, { useState } from 'react'

const UseStateEx = () => {

    // const [counter, setCounter] = useState(0);

    // function increment() {
    //     setCounter(counter + 1)
    // }

    // function decrement() {
    //     setCounter(counter - 1)
    // }


    // let counter = 0;

    // function increment() {
    //     counter++;
    // }

    // function decrement() {
    //     counter--;
    // } 

    const [user, setUser] = useState({
        name: 'Harshal Jain',
        age: 24,
        address: 'Indore'
    })

    function updateName() {
        setUser({
            ...user,
            name: 'Viraj Jain'
        })
    }
    return (
        <div >
            <h1>User Info</h1>
            <p>Name : {user.name}</p>
            <p>Age : {user.age}</p>
            <p>Address : {user.address}</p>
            <button onClick={updateName}>Update Name</button>
        </div>
    )
}

export default UseStateEx