import React, { useState } from 'react'
import useCounter from '../UseCustomHooks/useCounter';

const MyComp1 = () => {
   const [counter, increment, decrement] = useCounter();
    return (
        <div>
            <button onClick={increment}>+</button>
            <h1>{counter}</h1>
            <button onClick={decrement}>-</button>

        </div>
    )
}

export default MyComp1