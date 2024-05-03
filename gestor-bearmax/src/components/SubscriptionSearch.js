import React, { useState } from 'react';
import './SubscriptionSearch.css';

function SubscriptionSearch() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [subscriptions, setSubscriptions] = useState([]);

    const fetchSubscriptions = async () => {
        const fetchedSubscriptions = [
            { service: 'Netflix', startDate: '01/01/2021', endDate: '31/12/2023', image: 'https://i.ibb.co/Xx4hWw2/disney.png' },
           
        ];
        setSubscriptions(fetchedSubscriptions);
    };
 
    return (
        
        <div className="subscription-search-container">
            <img src="https://i.ibb.co/q0mVfVX/videofinal.png" alt="Logo de Empresa" className="company-logo" />
            <h1>Buscar número de teléfono</h1>
            <p>Ingresa un número de teléfono para ver las cuentas de streaming vinculadas.</p>

            <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ingresa el número"
            />

            <button onClick={fetchSubscriptions}>Buscar</button>

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
