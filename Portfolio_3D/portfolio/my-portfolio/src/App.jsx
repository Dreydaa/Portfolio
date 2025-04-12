import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Archi from './pages/Architecture';
import Other from './pages/Other';
import Clothes from './pages/Clothes';
import Animation from './pages/Animation';

function App() {
  return (
      <div>  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Architecture" element={<Archi />} />
        <Route path="/Other" element={<Other />} />
        <Route path="/Clothes" element={<Clothes />} />
        <Route path="/Animation" element={<Animation />} />
        {/* Route pour les pages non trouvées */}
      </Routes>
    </div>
  );
}

export default App;

