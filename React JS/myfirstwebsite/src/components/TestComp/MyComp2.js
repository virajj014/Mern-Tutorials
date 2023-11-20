import React, { useState } from 'react'
import useCounter from '../UseCustomHooks/useCounter';

const MyComp2 = () => {
    const [counter, increment, decrement] = useCounter(1);
    return (
        <div>
            <button onClick={increment}>+</button>
            <h1>{counter}</h1>
            <button onClick={decrement}>-</button>

        </div>
    )
}

export default MyComp2