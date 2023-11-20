import React, { useState } from 'react'

const useCounter = (initialValue= 10) => {
    const [counter, setCounter] = useState(initialValue);

    function increment() {
        setCounter(counter + 1);
    }

    function decrement() {
        setCounter(counter - 1);
    }

    return [counter, increment, decrement];
}

export default useCounter