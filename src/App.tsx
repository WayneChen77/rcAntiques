
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Room from './Room';
// import GamePlay from './GamePlay';
import GamePlay from './Gameplay';


function App() {
 

  return (
    <>
      <header className='mt-5'>
        <h1 className='text-center bold'>古董局中局非官方輔助</h1>
      </header>
      <div className="container">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/serveroom/:roomId" element={<Room />} />
          <Route path="/GamePlay/:roomId" element={<GamePlay />} />

          {/* <Route path="/about" element={<About />} /> */}
        </Routes>

      </div>
      <footer className='my-2' style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <div className='text-center'>  Copyright © 2024 Wayne</div>
      </footer>
    </>
  )
}

export default App
