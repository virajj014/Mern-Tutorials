import React, { useCallback } from 'react'
import MyComp1 from './MyComp1';

const UseCallbackEx = () => {
    const [count, setCount] = React.useState(0);
    let a = 10;
    let myfunc1 = useCallback(
        () => {
            console.log('myfunc1 is called');
        },[]
    )
    return (
        <div>
            <h1>{count}</h1>
            <MyComp1 a={a} myfunc1={myfunc1}/>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    )
}

export default UseCallbackEx