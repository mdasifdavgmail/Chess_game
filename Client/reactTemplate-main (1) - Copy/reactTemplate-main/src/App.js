import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Game from './Game';
import './App.css';
import Login from './Login';
import Register from './Register';

function App() {
  return (
    <div className="App">
     
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Game/>}></Route>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
