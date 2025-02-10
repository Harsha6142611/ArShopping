import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard';
import Shop from './components/Shop.jsx';
import './App.css'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/shop" element={<Shop/>}/>
            </Routes>
        </Router>
    );
}

export default App;
