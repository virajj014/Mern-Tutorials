import React, { useContext } from 'react'
import MyContext from '../contexts/MyContext';

const C2 = () => {
    const contextData = useContext(MyContext);

    const {setName , name} = contextData;

    const changeName = () => {
        setName('React js is awesome');
    }

  return (
    <div>C2 
    <button onClick={changeName}>Change Name</button>
    </div>
  )
}

export default C2