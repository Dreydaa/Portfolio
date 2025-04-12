// src/routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Archi from "./components/Architecture"


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/architecture" element={<Archi />} />
    </Routes>
  );
};

export default AppRoutes;
