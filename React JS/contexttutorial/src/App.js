import logo from './logo.svg';
import './App.css';
import C1 from './components/C1';
import { useState } from 'react';
import C2 from './components/C2';
import MyContext from './contexts/MyContext';

function App() {
  const [name, setName] = useState('Viraj Jain');

  const data = {
    name: name,
    setName: setName
  }

  return (
    <MyContext.Provider value={data}>
      <div className="App">
        <C1/>
        <C2/>
      </div>
    </MyContext.Provider>
  );
}

export default App;
