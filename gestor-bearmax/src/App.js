
//ruta de home page
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubscriptionSearch from './components/SubscriptionSearch';
import HomePage from './components/HomePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SubscriptionSearch />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Router>
    );
}

export default App;
