import React from 'react'
import './Navbar.css'
import Footer from '../Footer/Footer'
const Navbar = (data) => {
    const items = ['Home', 'About', 'Contact']
    console.log(data.data)
    return (
        <div className='navbar'>
            <h1>{data.data}</h1>
            {
                items.map((item) => {
                    return <div style={{
                        backgroundColor: 'red',
                        padding: '10px',
                        margin: '10px',
                    }}>{item}</div>
                })  
            }
        </div>
    )
}

export default Navbar