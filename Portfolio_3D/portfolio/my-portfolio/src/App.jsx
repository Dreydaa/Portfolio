import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Archi from './pages/Architecture';
import Clothes from './pages/Clothes';

function App() {
  return (
      <div>  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Blender" element={<Archi />} />
        <Route path="/WebDesign" element={<Clothes />} />
        {/* Route pour les pages non trouvées */}
      </Routes>
    </div>
  );
}

export default App;

