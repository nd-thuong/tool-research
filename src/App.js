import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Editor from './EditorImage';
import Slider from './Slider';
import View from './View';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route path="/view" element={<View />} />
        <Route path="/slide" element={<Slider />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;