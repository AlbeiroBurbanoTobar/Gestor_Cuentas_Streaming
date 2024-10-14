import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SubscriptionSearch from './components/SubscriptionSearch';
import HomePage from './components/HomePage';
import RegisterSales from './components/RegisterSales';
import StatisticsPage from './components/StatisticsPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<SubscriptionSearch />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/register-sales" element={<RegisterSales />} />
                <Route path="/statistics" element={<StatisticsPage />} />
            </Routes>
        </Router>
    );
}

export default App;
