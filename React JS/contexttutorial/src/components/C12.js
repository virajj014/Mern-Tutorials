import React, { useContext } from 'react'
import MyContext from '../contexts/MyContext'

const C12 = () => {
    const contextData = useContext(MyContext);
  return (
    <div>C12 {contextData.name}</div>
  )
}

export default C12