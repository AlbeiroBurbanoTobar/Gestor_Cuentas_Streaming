import React, { useState, useEffect } from 'react';
import './SubscriptionSearch.css';

function SubscriptionSearch() {
    const [phoneNumber, setPhoneNumber] = useState('');  // Estado para guardar el número de teléfono
    const [subscriptions, setSubscriptions] = useState([]);  // Estado para guardar las suscripciones
    const [showLogin, setShowLogin] = useState(false);  // Estado para controlar la visibilidad de la interfaz de inicio de sesión
    let pressTimer; // Variable para almacenar el temporizador

    // Función para simular la carga de suscripciones
    const fetchSubscriptions = async () => {
        const fetchedSubscriptions = [
            { service: 'Netflix', startDate: '01/01/2021', endDate: '31/12/2023', image: 'https://i.ibb.co/Xx4hWw2/disney.png' },
        ];
        setSubscriptions(fetchedSubscriptions);
    };

    // Manejador para cuando se presiona el logo
    const handleLogoPress = () => {
        pressTimer = window.setTimeout(() => {
            setShowLogin(true);  // Activa la interfaz de inicio de sesión después de 500 ms
        }, 1000); // Define el tiempo que el usuario debe mantener presionado (1000 ms en este ejemplo)
    };

    // Manejador para cuando se suelta el logo
    const handleLogoRelease = () => {
        clearTimeout(pressTimer); // Cancela el temporizador si el usuario suelta antes de tiempo
    };

    // Función para cerrar la interfaz de inicio de sesión
    const closeLogin = () => {
        setShowLogin(false);  // Desactiva la interfaz de inicio de sesión
    };

    useEffect(() => {
        return () => {
            // Limpieza al desmontar el componente
            clearTimeout(pressTimer);
        };
    }, []);

    return (
        <div className="subscription-search-container">
        <img
             src="https://i.ibb.co/q0mVfVX/videofinal.png"
             alt="Logo de la Empresa"
             className="company-logo"
             onMouseDown={handleLogoPress}
             onMouseUp={handleLogoRelease}
             onMouseLeave={handleLogoRelease}  // Asegura que el temporizador se cancele si el cursor deja el área del logo
        />

        <h1>Buscar número de teléfono</h1>
        <p>Ingresa un número de teléfono para ver las cuentas de streaming vinculadas.</p>

        <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Ingresa el número"
        />

        <button onClick={fetchSubscriptions}>Buscar</button>

        {showLogin && ( // Renderizado condicional
            <div className="login-modal">
                <h2>Iniciar Sesión</h2>
                <input type="email" placeholder="Correo electrónico" />
                <input type="password" placeholder="Contraseña" />
                <button onClick={closeLogin}>Iniciar Sesión</button>
            </div>
        )}

        <ul className="subscriptions-list">
            {subscriptions.map((sub, idx) => (
                <li key={idx} className="subscription-item">
                    <img src={sub.image} alt={sub.service} className="subscription-image" />
                    <div className="subscription-details">
                        <strong>{sub.service}</strong>
                        <div className="dates">
                            Suscripción activa desde el {sub.startDate}<br />
                            Vence el {sub.endDate}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

}

export default SubscriptionSearch;
