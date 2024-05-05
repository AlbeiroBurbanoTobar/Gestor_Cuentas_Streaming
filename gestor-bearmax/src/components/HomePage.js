import React, { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";
import { auth, db } from '../../src/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';


function HomePage() {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [service, setService] = useState('');
    const [filterDate, setFilterDate] = useState(new Date());
    const [userCount, setUserCount] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [subscriptionsToDisplay, setSubscriptionsToDisplay] = useState([]);

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

    const fetchSubscriptionsByEndDate = async () => {
        const subsRef = collection(db, "Usuarios");
        const q = query(subsRef, where("endDate", "<=", filterDate.toISOString()));
        const querySnapshot = await getDocs(q);
        const subs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubscriptionsToDisplay(subs);
    };
    const deleteSubscriptions = async () => {
        for (let sub of subscriptionsToDisplay) {
            const subRef = doc(db, "Usuarios", sub.id);
            await deleteDoc(subRef);
        }
        alert('Suscripciones eliminadas correctamente.');
        setSubscriptionsToDisplay([]);
        setShowModal(false);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            alert('Has cerrado sesión exitosamente.');
            navigate('/'); // Asegúrate de que esta ruta corresponde a SubscriptionSearch en tu configuración de rutas
        } catch (error) {
            alert('Error al cerrar sesión: ' + error.message);
        }
    };
    const handleDelete = async () => {
        // Lógica para borrar suscripciones...
        console.log('Borrando suscripciones...');
        setShowModal(false); // Oculta el modal después de la acción
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
                <h1 style={styles.header}>Joa Mani!</h1>
                <p style={styles.subHeader}>Has iniciado sesión exitosamente en nuestra plataforma.</p>
                <div className="button-container">
                    <button style={styles.button} onClick={handleSignOut}>Cerrar Sesión</button>
                    <button style={styles.button} onClick={() => setShowModal(true)}>Borrar suscripciones</button>

                </div>
    {/* Contenido existente aquí */}
            {showModal && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <h2>Buscar y Eliminar Suscripciones</h2>
                        <DatePicker
                            selected={filterDate}
                            onChange={date => setFilterDate(date)}
                            style={styles.input}
                        />
                        <button style={styles.button} onClick={fetchSubscriptionsByEndDate}>Buscar Suscripciones</button>
                        {subscriptionsToDisplay.map(sub => (
                            <div key={sub.id}>
                                {sub.userName} - {sub.endDate}
                            </div>
                        ))}
                        <button style={styles.button} onClick={deleteSubscriptions}>Eliminar Suscripciones</button>
                        <button style={styles.button} onClick={() => setShowModal(false)}>Cancelar</button>
                    </div>
                </div>
                
            )}

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
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',  // Fondo negro con un poco de transparencia
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1050,  // Asegura que esté por encima de otros elementos
        color: '#fff',  // Cambia el color del texto a blanco para contraste
    },
    
    modalContent: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',  // Fondo casi negro para el contenido del modal
        padding: '20px',
        borderRadius: '8px',
        width: 'auto',
        maxWidth: '400px',
        textAlign: 'center',  // Asegura que el texto esté centrado
    },
    button: {
        margin: '10px',
        // Otros estilos de botón...
    }
};

export default HomePage;
