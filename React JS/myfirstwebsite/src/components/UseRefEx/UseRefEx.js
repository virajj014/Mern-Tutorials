// import React, { useEffect, useRef, useState } from 'react'

// const UseRefEx = () => {
//     const [name, setName] = useState("")
//     // const [count , setCount] = useState(0)

//     const renderCount = useRef(0)


//     useEffect(() => {
//         renderCount.current = renderCount.current + 1
//         // setCount((prev) => prev + 1)
//     })
//     return (
//         <div>
//             <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
//             <h1>The number of times render occured: {renderCount.current}</h1>

//         </div>
//     )
// }

// export default UseRefEx




import React, { useEffect, useRef } from 'react'

const UseRefEx = () => {

    const inputRef = useRef(null);

    useEffect(() => {
        console.log(inputRef.current)
        inputRef.current.focus()
        inputRef.current.value = 'Harshal Jain'
    }, [])

    const handleClick = () => {
        console.log(inputRef.current.value)


        // change the background color of the input field
        inputRef.current.style.backgroundColor = 'red'
    }
  return (
    <div>
        <input ref={inputRef} type="text" />
        <button onClick={handleClick}>Click me</button>
    </div>
  )
}

export default UseRefEx