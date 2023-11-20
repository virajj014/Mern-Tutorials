import React, { useReducer } from 'react'

const UseReducerEx = () => {
    let initialState = 0;

    const reducerFunc = (state, action) => {
        if(action.type === 'INCREMENT') {
            return state + 1
        }
        else if(action.type === 'DECREMENT') {
            return state - 1
        }
        else if(action.type === 'RESET') {
            return initialState
        }
        return state
    }
    // const [count , setCount] = React.useState(0)

    const [mystate1 , mydispatch1] = useReducer(reducerFunc , initialState)
    return (
        <div style={{

            display: 'flex',
            padding: '20px',
        }}>
            {/* <button onClick={() => setCount(count + 1)}>+</button>
        <h1>{count}</h1>
        <button onClick={() => setCount(count - 1)}>-</button> */}

         <button onClick={() => mydispatch1({type: "INCREMENT"})}>+</button>
        <h1>{mystate1}</h1>
        <button onClick={() => mydispatch1({type: "DECREMENT"})}>-</button>
        <button onClick={() => mydispatch1({type: "RESET"})}>Reset</button>
        </div>
    )
}

export default UseReducerEx