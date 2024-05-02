// components/SubscriptionSearch.js

import React, { useState } from 'react';
import './SubscriptionSearch.css';

/**
 * SubscriptionSearch es un componente de React que permite a los usuarios buscar cuentas de streaming vinculadas a un número de teléfono.
 * 
 * Los usuarios pueden ingresar un número de teléfono en un campo de entrada, y al hacer clic en el botón "Buscar", 
 * el componente muestra una lista de suscripciones de streaming vinculadas a ese número.
 */
function SubscriptionSearch() {
    // Estado para almacenar el número de teléfono ingresado por el usuario
    const [phoneNumber, setPhoneNumber] = useState('');

    // Estado para almacenar la lista de suscripciones obtenida
    const [subscriptions, setSubscriptions] = useState([]);

    /**
     * fetchSubscriptions es una función asíncrona que obtiene la lista de suscripciones vinculadas a un número de teléfono.
     * 
     * Actualmente, la función usa datos estáticos para demostrar la funcionalidad. En una implementación real, 
     * esta función podría realizar una llamada a un backend para obtener la lista de suscripciones desde una base de datos o API.
     */
    const fetchSubscriptions = async () => {
        const fetchedSubscriptions = [
            { service: 'Netflix', startDate: '01/01/2021', endDate: '31/12/2023' },
            { service: 'Disney+', startDate: '15/06/2022', endDate: '14/06/2024' },
            { service: 'Paramount+', startDate: '01/08/2021', endDate: '31/08/2023' },
            { service: 'HBO Max', startDate: '01/05/2022', endDate: '30/04/2023' },
        ];
        setSubscriptions(fetchedSubscriptions);
    };

    return (
        <div className="subscription-search-container">
            <h1>Buscar número de teléfono</h1>
            <p>Ingresa un número de teléfono para ver las cuentas de streaming vinculadas.</p>

            {/* Campo de entrada para el número de teléfono */}
            <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ingresa el número"
            />

            {/* Botón para realizar la búsqueda de suscripciones */}
            <button onClick={fetchSubscriptions}>Buscar</button>

            {/* Lista de suscripciones vinculadas */}
            <ul className="subscriptions-list">
                {subscriptions.map((sub, idx) => (
                    <li key={idx}>
                        <strong>{sub.service}</strong>
                        <div className="dates">
                            Suscripción activa desde el {sub.startDate}<br />
                            Vence el {sub.endDate}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SubscriptionSearch;
