import React, { useState, useEffect } from 'react';
import './SubscriptionSearch.css';
import { db, auth } from '../../src/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function SubscriptionSearch() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [subscriptions, setSubscriptions] = useState([]);
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let pressTimer;

    // Manejadores para mostrar el login al presionar el logo
    const handleLogoPress = () => {
        pressTimer = window.setTimeout(() => {
            setShowLogin(true);
        }, 1000);
    };

    const handleLogoRelease = () => {
        clearTimeout(pressTimer);
    };

    // Función para manejar el inicio de sesión
    const handleLogin = async () => {
        if (!email || !password) {
            alert('Por favor, completa ambos campos: correo electrónico y contraseña.');
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Inicio de sesión exitoso: ", userCredential.user);
            navigate('/home', { replace: true });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert(`Error al iniciar sesión: ${error.message}`);
        }
    };

    // Función para buscar suscripciones asociadas a un número de teléfono
    const fetchSubscriptions = async () => {
        if (!phoneNumber) {
            alert("Por favor, ingresa un número de teléfono.");
            return;
        }

        const usersRef = collection(db, "Usuarios");
        const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            setSubscriptions([]);
            alert("No se encontraron suscripciones para este número de teléfono.");
            return;
        }

        const userData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const userSubscriptions = userData.map(user => ({
            id: user.id, 
            service: user.service.split(", "),
            startDate: user.startDate,
            endDate: user.endDate,
            daysRemaining: calculateDaysRemaining(user.endDate)
        }));

        setSubscriptions(userSubscriptions);
    };

    // Calcular los días restantes hasta la endDate
    const calculateDaysRemaining = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        return Math.max(Math.ceil((end - today) / (1000 * 60 * 60 * 24)), 0);
    };

    const closeLogin = () => {
        setShowLogin(false);
    };

    useEffect(() => {
        return () => clearTimeout(pressTimer);
    }, []);

    return (
        <div className="subscription-search-container">
            <img
                src="https://i.ibb.co/q0mVfVX/videofinal.png"
                alt="Logo de la Empresa"
                className="company-logo"
                onMouseDown={handleLogoPress}
                onMouseUp={handleLogoRelease}
                onMouseLeave={handleLogoRelease}
            />
        
            <p>Ingresa un número de teléfono para ver las cuentas de streaming vinculadas.</p>
            <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ingresa el número"
            />
            <button onClick={fetchSubscriptions}>Buscar</button>
            {subscriptions.length > 0 && (
                <ul className="subscriptions-list">
                    {subscriptions.map((sub, index) => (
                        <li key={index} className="subscription-item">
                            {sub.service.map(service => (
                                <div key={service}>
                                    Servicio: {service} <br/>
                                    Fecha de inicio: {sub.startDate} <br/>
                                    Fecha de finalización: {sub.endDate} <br/>
                                    Días restantes: {sub.daysRemaining}
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            )}
            {showLogin && (
                <div className="login-modal">
                    <h2>Iniciar Sesión</h2>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                    />
                    <button onClick={handleLogin}>Iniciar Sesión</button>
                    <button onClick={closeLogin}>Cerrar</button>
                </div>
            )}
        </div>
    );
}

export default SubscriptionSearch;
