import React from "react";
import InputForm from "./components/InputForm";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageOptimisation from "./components/PageOptimisation";
import Header from "./components/Header";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<InputForm />} />
            <Route path="/optimisation" element={<PageOptimisation />} />
          </Routes>
        </main>
        <ThemeToggle />
      </div>
    </Router>
  );
}

export default App;
