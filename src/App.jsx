import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Stocks from './pages/Stocks';
import StockDetail from './pages/StockDetail';
import Tutorials from './pages/Tutorials';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/stocks"         element={<Stocks />} />
        <Route path="/stocks/:ticker" element={<StockDetail />} />
        <Route path="/tutorials"      element={<Tutorials />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
