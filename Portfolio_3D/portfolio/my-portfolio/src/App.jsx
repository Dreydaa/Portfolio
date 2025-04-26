import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Archi from './pages/Architecture';
import Clothes from './pages/Clothes';
import BlenderPTH from './pages/BlenderPTH';

function App() {
  return (
      <div>  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Blender" element={<Archi />} />
        {/* Project in Blender */}
        <Route path='/DreamPenthouse' element={<BlenderPTH />} />



        <Route path="/WebDesign" element={<Clothes />} /> 
        {/* Project in WebDesign */}       {/* Route pour les pages non trouvées */}
      </Routes>
    </div>
  );
}

export default App;

