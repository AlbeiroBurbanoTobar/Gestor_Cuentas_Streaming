import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { db } from '../../src/firebaseConfig';  // Importar Firebase Firestore
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate
import './RegisterSales.css';

function RegisterSales() {
    const [saleDate, setSaleDate] = useState(new Date());
    const [saleType, setSaleType] = useState('');
    const [unitPrice, setUnitPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [investment, setInvestment] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);

    const navigate = useNavigate();  // Inicializamos useNavigate para navegar entre rutas

    // Calcular Total Ventas y Total Ganancia
    const calculateTotals = () => {
        const totalSalesValue = unitPrice * quantity;
        const totalProfitValue = totalSalesValue - investment;
        setTotalSales(totalSalesValue);
        setTotalProfit(totalProfitValue);
    };

    // Manejar el envío del formulario y guardar la venta en Firebase
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await addDoc(collection(db, 'Ventas'), {
                saleDate: saleDate.toISOString(),
                saleType,
                unitPrice,
                quantity,
                totalSales,
                investment,
                totalProfit
            });
            alert('Venta agregada exitosamente.');

            // Restablecer los campos del formulario
            setSaleDate(new Date());
            setSaleType('');
            setUnitPrice(0);
            setQuantity(0);
            setTotalSales(0);
            setInvestment(0);
            setTotalProfit(0);

        } catch (error) {
            console.error('Error guardando la venta:', error);
            alert('Error al agregar la venta: ' + error.message);
        }
    };

    // Función para el botón cancelar
    const handleCancel = () => {
        navigate('/home');  // Redirigir a la página principal
    };

    return (
        <div className="register-sales-container">
            <h2>REGISTRO VENTAS</h2>
            <div className="header">
                <button className="btn green" onClick={handleSubmit}>AGREGAR VENTA</button>
                <button className="btn red" onClick={handleCancel}>CANCELAR</button>  {/* Botón cancelar */}
                <span>{new Date().toLocaleDateString()}</span>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
                <div className="form-group">
                    <label>Fecha</label>
                    <DatePicker selected={saleDate} onChange={date => setSaleDate(date)} />
                </div>

                <div className="form-group">
                    <label>Tipo de</label>
                    <select value={saleType} onChange={(e) => setSaleType(e.target.value)}>
                        <option value="">Seleccione el tipo</option>
                        <option value="">Seleccione el tipo</option>
                        <option value="Netflix completa">Netflix completa</option>
                        <option value="Netflix pantalla">Netflix pantalla</option>
                        <option value="Prime Video completa">Prime Video completa</option>
                        <option value="Prime Video pantalla">Prime Video pantalla</option>
                        <option value="Disney completa">Disney completa</option>
                        <option value="Disney pantalla">Disney pantalla</option>
                        <option value="Crunchyroll Completa">Crunchyroll Completa</option>
                        <option value="Crunchyroll pantalla">Crunchyroll pantalla</option>
                        <option value="Vix completa">Vix completa</option>
                        <option value="Vix pantalla">Vix pantalla</option>
                        <option value="MAX completa">MAX completa</option>
                        <option value="MAX pantalla">MAX pantalla</option>
                        <option value="Paramount completa">Paramount completa</option>
                        <option value="Paramount pantalla">Paramount pantalla</option>
                        <option value="Spotify">Spotify</option>
                        <option value="YouTube Premium">YouTube Premium</option>
                        <option value="Plex">Plex</option>
                        <option value="IPTV">IPTV</option>
                        <option value="Canva Pro">Canva Pro</option>
                        <option value="Viki Rakuten">Viki Rakuten</option>
                        <option value="PornHub">PornHub</option>
                        <option value="BearmaxPlay">BearmaxPlay</option>
                        <option value="COMBO">COMBO</option>
                        <option value="PROMO-COMBO">PROMO-COMBO</option>
                        <option value="Devolucion">Devolución</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Valor Unitario</label>
                    <input
                        type="number"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(Number(e.target.value))}
                        onBlur={calculateTotals} // Calcular totales al salir del campo
                    />
                </div>

                <div className="form-group">
                    <label>Cantidad</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        onBlur={calculateTotals} // Calcular totales al salir del campo
                    />
                </div>

                <div className="form-group">
                    <label>Total Ventas</label>
                    <input type="text" value={totalSales.toFixed(2)} readOnly />
                </div>

                <div className="form-group">
                    <label>Inversión</label>
                    <input
                        type="number"
                        value={investment}
                        onChange={(e) => setInvestment(Number(e.target.value))}
                        onBlur={calculateTotals} // Calcular totales al salir del campo
                    />
                </div>

                <div className="form-group">
                    <label>Total Ganancia</label>
                    <input type="text" value={totalProfit.toFixed(2)} readOnly />
                </div>
            </form>
        </div>
    );
}

export default RegisterSales;