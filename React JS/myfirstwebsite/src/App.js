import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import { useEffect, useState } from 'react';
// import UseStateEx from './components/UseStateEx/UseStateEx';
import UseEffectEx from './components/UseEffectEx/UseEffectEx';
import UseMemoEx from './components/UseMemoEx/UseMemoEx';
import UseRefEx from './components/UseRefEx/UseRefEx';
import UseReducerEx from './components/UseReducerEx/UseReducerEx';
import UseCallbackEx from './components/UseCallbackEx/UseCallbackEx';
import MyComp1 from './components/TestComp/MyComp1';
import MyComp2 from './components/TestComp/MyComp2';

function App() {
  //  const [counter, setCounter] = useState(0);

  //  function increment() {
  //    setCounter(counter + 1);
  //  }


  // let counter = 0;

  // function increment() {
  //   counter++;
  // }

  // useEffect(() => {
  //   console.log('useEffect ', counter);
  //   increment();
  // })


  // let name = 'Harshal Jain'
  return (
    <div className="App">
      <MyComp1 />
      <MyComp2 />
      {/* <UseCallbackEx /> */}
      {/* <UseReducerEx /> */}
      {/* <UseRefEx /> */}
      {/* <UseMemoEx /> */}
      {/* <UseEffectEx /> */}
      {/* <UseStateEx /> */}
      {/* <Navbar data={name}/>
      <div className='body'>
        <h1>This is my heading {counter}</h1>
        <p>
          This is my paragraph.
          This is my paragraph.
          This is my paragraph.
          This is my paragraph.
          This is my paragraph.
          This is my paragraph.
        </p>

        <button 
         onClick={increment}
        >
          Click me
        </button>
      </div>
      <Footer /> */}
    </div>
  );
}

export default App;



