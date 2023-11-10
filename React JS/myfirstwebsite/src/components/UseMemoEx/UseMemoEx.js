import React, { useMemo, useState } from 'react'




const MyComponent = ({number}) => {

    const result = useMemo(() => {
        return number * 10;
    }, [number])
    return (
        <div>
            <h1>Number : {number}</h1>
            <h2>Result : {result}</h2>
        </div>
    )
}

const UseMemoEx = () => {

    const [count, setCount] = useState(0);

    return (
        <div>
            <h1>UseMemo Example</h1>
            <button
                onClick={() => {
                    setCount(count + 1)
                }}
            >Increment</button>

            <button
                onClick={() => {
                    setCount(count - 1)
                }}
            >decrement</button>

            <MyComponent number={count}/>
        </div>
    )
}

export default UseMemoEx