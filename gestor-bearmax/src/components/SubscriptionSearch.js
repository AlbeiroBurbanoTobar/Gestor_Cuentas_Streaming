import React, { useState, useEffect } from 'react';
import './SubscriptionSearch.css';
import { db, auth } from '../../src/firebaseConfig';
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'; // Importando la función format
import moment from 'moment-timezone';

function SubscriptionSearch() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [subscriptions, setSubscriptions] = useState([]);
    const [showAdminPanel, setShowAdminPanel] = useState(false); // AGREGA ESTOOOOOOOOO
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    let pressTimer;

    const serviceLogos = {
        'Netflix': 'https://i.ibb.co/12fGpvt/netflix.png',
        'Disney plus': 'https://i.ibb.co/PM3rHk5/disney.png',
        'Paramount': 'https://i.ibb.co/3c8VKz7/paramount.png',
        'Prime Video': 'https://i.ibb.co/dGnWBK1/Prime.png',
        'Crunchyroll': 'https://i.ibb.co/QvsjVxW/crunchi.png',
        'Star plus': 'https://i.ibb.co/gvtkbSx/Untitled-design.png',
        'MAX': 'https://raw.githubusercontent.com/AlbeiroBurbano/ImagenesIconos/main/max.png',
        'Spotify': 'https://i.ibb.co/kSVmdPc/Spotify-1.png',
        'Canva Pro': 'https://i.ibb.co/0j7HtBV/canva.png',
        'Apple TV': 'https://i.ibb.co/WHdFPg5/Apletv.png',
        'IPTV': 'https://i.ibb.co/S6V37w5/iptv.png',
        'El profe net': 'https://i.ibb.co/bF1PBLT/net.png',
        'Smart One IPTV': 'https://i.ibb.co/cLFbWvY/Smart.png',
        'YouTube Premium': 'https://i.ibb.co/VMQDPrf/Youtu.png',
        'PornHub': 'https://i.ibb.co/80bK6Mm/porn.png',
        'Vix': 'https://i.ibb.co/23swSVk/vix.png',
        'Plex': 'https://i.ibb.co/4wqqPMq/Plex.png',
        'Viki': 'https://i.ibb.co/0GV26V2/viki.png',
        'DuplexPlay': 'https://i.ibb.co/kM7KLpW/duplex.png',
    };

    const handlePhoneNumberChange = (e) => { // AGREGA ESTOOOOOOOOO
        const value = e.target.value;
        setPhoneNumber(value);

        // Activar el panel de administrador si el número es '73'
        if (value === '73') {
            setShowAdminPanel(true);
        } else {
            setShowAdminPanel(false);
        }
    };

    const handleLogoPress = () => {
        pressTimer = window.setTimeout(() => {
            setShowLogin(true);
        }, 1000);
    };

    const handleLogoRelease = () => {
        clearTimeout(pressTimer);
    };

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

    const fetchSubscriptions = async () => {
        if (!phoneNumber) {
            alert("Por favor, ingresa un número de celular vinculado a tu cuenta de WhatsApp.");
            return;
        }
    
        const usersRef = collection(db, "Usuarios");
        const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
        const querySnapshot = await getDocs(q);
    
        if (querySnapshot.empty) {
            setSubscriptions([]);
            alert("No se encontraron suscripciones para este número de celular.");
            return;
        }
    
        const userData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            startDate: moment(doc.data().startDate).tz('America/Bogota').format('DD-MM-YYYY'),
            endDate: moment(doc.data().endDate).tz('America/Bogota').format('DD-MM-YYYY'),
            daysRemaining: calculateDaysRemaining(doc.data().endDate)
        }));
    
        setSubscriptions(userData);
    };

    const calculateDaysRemaining = (endDate) => {
        const today = moment().tz('America/Bogota').startOf('day'); // Fecha de hoy en la zona horaria de Colombia
        const end = moment(endDate).tz('America/Bogota').startOf('day'); // Fecha de finalización en la zona horaria de Colombia
    
        const difference = end.diff(today, 'days'); // Diferencia en días
        return Math.max(difference, 0); // Asegurarse de que no se devuelvan valores negativos
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
        
            <p>Ingresa el número de celular vinculado a tu cuenta de WhatsApp para ver las cuentas 
                de streaming asociadas.
            </p>
            <input
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneNumberChange} // AGREGA ESTOOOOOOOOO
                placeholder="Ingresa tu número de celular"
            />
            <button 
            onClick={fetchSubscriptions} 
            onMouseDown={handleLogoPress}  
            onMouseUp={handleLogoRelease}  
            onMouseLeave={handleLogoRelease}  
            >
            Buscar
            </button>

            {/* AGREGA ESTOOOOOOOOO: Mostrar el panel de administrador si el número ingresado es '73' */}
            {showAdminPanel && (
                <div className="admin-panel">
                    <h2>Panel de Administrador</h2>
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

            {subscriptions.length > 0 && (
                <ul className="subscriptions-list">
                    {subscriptions.map((sub, index) => (
                    <li key={index} className="subscription-item">
                        <img src={serviceLogos[sub.service]} alt={sub.service} className="subscription-logo"/>
                        <div className="subscription-details">
                            <div className="service-detail">{sub.service}</div>
                            Suscripción activa desde el {sub.startDate} <br/>
                            Vence {sub.endDate} <br/>
                            Días restantes: {sub.daysRemaining}
                        </div>
                    </li>
                ))}

                </ul>
            )}
        </div>
    );
}

export default SubscriptionSearch;
