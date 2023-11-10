import React, { useEffect, useState } from 'react'

const UseEffectEx = () => {

    const [counter, setCounter] = useState(0);

    function increment() {
        setCounter(counter + 1)
    }


    const [data, setData] = useState([])

    useEffect(() => {
        // get data from api
        // console.log('useEffect called')
        // let res = [
        //     {
        //         name: 'Harshal Jain',
        //         age: 24
        //     },
        //     {
        //         name: 'Harshal Jain 1 ',
        //         age: 4524
        //     },
        //     {
        //         name: 'Harshal Jain 2',
        //         age: 214
        //     }
        // ]


        // setData(res) 



        fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(res => {
                console.log(res)
                setData(res)
            })
    },[counter])





    return (
        <div >
            <h1>{counter}</h1>
            {data.map((item, index) => {
                return (
                    <div key={index}>
                        <p>{item.title}</p>
                        <img src={item.thumbnailUrl} alt="" />
                     
                    </div>
                )
            })}

            <button onClick={increment}>Increment</button>
        </div>
    )
}

export default UseEffectEx