import React, { useState, useEffect } from 'react';
import './SubscriptionSearch.css'; // Asegúrate de que el path es correcto
import { db } from '../../src/firebaseConfig'; // Ruta corregida según tu estructura
import { collection, query, where, getDocs } from 'firebase/firestore';

function SubscriptionSearch() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [subscriptions, setSubscriptions] = useState([]);
    const [showLogin, setShowLogin] = useState(false);  // Opcional, según tu requerimiento
    let pressTimer; // Opcional, según tu requerimiento

    const fetchSubscriptions = async () => {
        if (!phoneNumber) {
            alert("Por favor, ingresa un número de teléfono.");
            return;
        }

        const usersRef = collection(db, "Usuarios");
        const q = query(usersRef, where("Numero", "==", phoneNumber));

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

        // Suponiendo que 'Cuentas' es un array de strings con nombres de plataformas
        const userSubscriptions = userData.flatMap(user => user.Cuentas.map(cuenta => ({
            service: cuenta
        })));

        setSubscriptions(userSubscriptions);
    };

    useEffect(() => {
        // Asegurándose de limpiar el timer si lo usas
        return () => clearTimeout(pressTimer);
    }, []);

    return (
        <div className="subscription-search-container">
            <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Ingresa el número"
            />
            <button onClick={fetchSubscriptions}>Buscar</button>

            {subscriptions.length > 0 && (
                <ul className="subscriptions-list">
                    {subscriptions.map((sub, idx) => (
                        <li key={idx} className="subscription-item">
                            {sub.service}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default SubscriptionSearch;

