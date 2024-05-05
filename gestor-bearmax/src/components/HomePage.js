import React, { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";
import { auth, db } from '../../src/firebaseConfig';
import { useLocation, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

function HomePage() {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [service, setService] = useState('');
    const [userCount, setUserCount] = useState(null);

    // Cargar el contador al cargar el componente
    useEffect(() => {
        const loadUserCount = async () => {
            const countRef = doc(db, "Config", "UserCounter");
            const countSnap = await getDoc(countRef);
            if (countSnap.exists()) {
                setUserCount(countSnap.data().count);
            } else {
                console.log("No user counter document found");
            }
        };
        loadUserCount();
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            alert('Has cerrado sesión exitosamente.');
            navigate('/login');
        } catch (error) {
            alert('Error al cerrar sesión: ' + error.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (userCount === null) {
            alert('El contador de usuarios no está disponible.');
            return;
        }

        const nextUserNumber = userCount + 1;
        const userName = `usuario${nextUserNumber}`;
        const subscriptionData = {
            email: userName,
            phoneNumber,
            startDate: startDate.toISOString(), 
            endDate: endDate.toISOString(),
            service
        };

        try {
            const userRef = doc(db, "Usuarios", userName);
            await setDoc(userRef, subscriptionData);
            await updateDoc(doc(db, "Config", "UserCounter"), { count: nextUserNumber });
            setUserCount(nextUserNumber);  // Actualizar el estado local con el nuevo contador
            alert('Datos guardados exitosamente bajo el nombre ' + userName);
        } catch (error) {
            alert('Error al guardar datos: ' + error.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.content}>
                <h1 style={styles.header}>Bienvenido!</h1>
                <p style={styles.subHeader}>Has iniciado sesión exitosamente en nuestra plataforma.</p>
                <button style={styles.button} onClick={handleSignOut}>Cerrar Sesión</button>
                <h2 style={styles.formTitle}>Registrar nueva suscripción</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Número de teléfono:</label>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Fecha de inicio:</label>
                        <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Fecha de finalización:</label>
                        <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Servicio de streaming:</label>
                        <select
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            style={styles.select}
                        >
                            <option value="">Selecciona un servicio</option>
                            <option value="Netflix">Netflix</option>
                            <option value="HBO">MAX</option>
                            <option value="Disney plus">Disney plus</option>
                            <option value="Paramount">Paramount</option>
                            <option value="Prime Video">Prime Video</option>
                            <option value="Crunchyroll">Crunchyroll</option>
                            <option value="Star plus">Star plus</option>
                        </select>
                    </div>
                    <button type="submit" style={styles.button}>Enviar</button>
                </form>
            </div>
        </div>
    );
}

// Estilos aquí
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.85)', // Dark background for the full page
        color: '#fff', // Light text
        fontFamily: 'Arial, sans-serif',
    },
    content: {
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Translucent dark background for the content
        width: '90%',
        maxWidth: '600px',
        boxSizing: 'border-box'
    },
    header: {
        textAlign: 'center'
    },
    subHeader: {
        textAlign: 'center',
        fontSize: '16px',
        margin: '10px 0'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '20px 0'
    },
    formGroup: {
        marginBottom: '15px',
        width: '100%'
    },
    label: {
        marginBottom: '5px',
        display: 'block'
    },
    input: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: 'white'
    },
    select: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        backgroundColor: 'black', // Fondo negro
        color: 'white' // Texto blanco
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#007BFF',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white'
    },
    formTitle: {
        textAlign: 'center',
        margin: '20px 0'
    }
};
export default HomePage;
