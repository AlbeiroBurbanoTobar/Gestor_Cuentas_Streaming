import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../src/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import './StatisticsPage.css';
import { Bar, Line, Scatter, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js'; 
Chart.register(...registerables);


function StatisticsPage() {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [totalSales, setTotalSales] = useState(0);
    const [totalInvestment, setTotalInvestment] = useState(0);
    const [totalProfit, setTotalProfit] = useState(0);
    const [salesByType, setSalesByType] = useState({});

    const navigate = useNavigate();

    const fetchSalesData = async () => {
        try {
            const salesRef = collection(db, 'Ventas');
            const q = query(salesRef);
            const querySnapshot = await getDocs(q);
            
            let totalSalesValue = 0;
            let totalInvestmentValue = 0;
            let totalProfitValue = 0;
            const salesByType = {};

            querySnapshot.forEach((doc) => {
                const sale = doc.data();
                const saleDate = new Date(sale.saleDate);
                
                // Filtrar por mes y año seleccionados
                if (saleDate.getFullYear() === selectedYear && saleDate.getMonth() + 1 === selectedMonth) {
                    const { saleType, unitPrice, quantity, totalSales, investment, totalProfit } = sale;

                    if (!salesByType[saleType]) {
                        salesByType[saleType] = {
                            totalQuantity: 0,
                            totalRevenue: 0,
                            totalInvestment: 0,
                            totalProfit: 0
                        };
                    }

                    salesByType[saleType].totalQuantity += quantity;
                    salesByType[saleType].totalRevenue += unitPrice * quantity;
                    salesByType[saleType].totalInvestment += investment;
                    salesByType[saleType].totalProfit += totalProfit;

                    totalSalesValue += totalSales;
                    totalInvestmentValue += investment;
                    totalProfitValue += totalProfit;
                }
            });

            setTotalSales(totalSalesValue);
            setTotalInvestment(totalInvestmentValue);
            setTotalProfit(totalProfitValue);
            setSalesByType(salesByType);

        } catch (error) {
            console.error("Error fetching sales data: ", error);
        }
    };

    useEffect(() => {
        fetchSalesData();
    }, [selectedMonth, selectedYear]);

    const goToHome = () => {
        navigate('/home');
    };


    const barChartData = {
        labels: Object.keys(salesByType),
        datasets: [
            {
                label: 'Ingresos por plataforma',
                data: Object.values(salesByType).map(sale => sale.totalRevenue),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderWidth: 1
            }
        ]
    };


    const lineChartData = {
        labels: Object.keys(salesByType),
        datasets: [
            {
                label: 'Ganancia Total',
                data: Object.values(salesByType).map(sale => sale.totalProfit),
                fill: false,
                borderColor: '#742774',
                tension: 0.1
            }
        ]
    };


    const scatterChartData = {
        datasets: [
            {
                label: 'Relación entre Ventas e Inversión',
                data: Object.values(salesByType).map(sale => ({
                    x: sale.totalInvestment,
                    y: sale.totalRevenue
                })),
                backgroundColor: 'rgba(255, 99, 132, 1)'
            }
        ]
    };

        // Gráfico de Cascada (Pirámide) 
        const pyramidChartData = {
            labels: ['Ventas', 'Costos', 'Inversión', 'Ganancia'],
            datasets: [
                {
                    label: 'Contribución a la Ganancia',
                    data: [
                        totalSales,
                        totalInvestment, // Asumimos que los costos son iguales a la inversión
                        totalInvestment,
                        totalProfit
                    ],
                    backgroundColor: ['#36a2eb', '#ff6384', '#ffce56', '#4bc0c0']
                }
            ]
        };
    
      // Gráfico de Torta
const pieChartData = {
    labels: Object.keys(salesByType),
    datasets: [
        {
            label: 'Cantidad de Ventas por Plataforma',
            data: Object.values(salesByType).map(sale => sale.totalQuantity),
            backgroundColor: [
                '#FF6384', // Rojo
                '#36A2EB', // Azul
                '#FFCE56', // Amarillo
                '#4BC0C0', // Verde agua
                '#9966FF', // Púrpura
                '#FF9F40', // Naranja
                '#66FF66', // Verde claro
                '#C9CBCF', // Gris claro
                '#8E44AD', // Púrpura oscuro
                '#3498DB', // Azul intenso
                '#F39C12', // Naranja dorado
                '#1ABC9C', // Turquesa
                '#E74C3C', // Rojo intenso
                '#D35400', // Naranja oscuro
                '#2ECC71'  // Verde esmeralda
            ]
        }
    ]
};


    return (
        <div className="container">
            <div className="box-container">
                <button className="close-button" onClick={goToHome}>X</button>

                <h1 className="header">Estadísticas de Ventas</h1>
                <div className="filter-container">
                    <label>Mes:</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="select"
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {new Date(0, i).toLocaleString('default', { month: 'long' })}
                            </option>
                        ))}
                    </select>

                    <label>Año:</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="select"
                    >
                        {[...Array(5)].map((_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            );
                        })}
                    </select>

                    <button onClick={fetchSalesData} className="button">Aplicar Filtros</button>
                </div>

                {/* Resumen de ventas por tipo de suscripción */}
                <h2 className="sub-header">Resumen por Tipo de Suscripción</h2>
                <div className="sales-type-container">
                    {Object.entries(salesByType).map(([type, data]) => (
                        <div className="sales-type-box" key={type}>
                            <h3>{type}</h3>
                            <p><strong>Total Cantidad Vendida:</strong> {data.totalQuantity}</p>
                            <p><strong>Ingresos Totales:</strong> ${data.totalRevenue.toFixed(2)}</p>
                            <p><strong>Inversión Total:</strong> ${data.totalInvestment.toFixed(2)}</p>
                            <p><strong>Ganancia Total:</strong> ${data.totalProfit.toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                {/* Resumen general */}
                <div className="stats-container">
                    <div className="stat-box">
                        <h3>Total de Ventas:</h3>
                        <p>${totalSales.toFixed(2)}</p>
                    </div>
                    <div className="stat-box">
                        <h3>Total Inversión:</h3>
                        <p className="investment">${totalInvestment.toFixed(2)}</p>
                    </div>
                    <div className="stat-box">
                        <h3>Total Ganancia:</h3>
                        <p>${totalProfit.toFixed(2)}</p>
                    </div>
                </div>

                 {/* Gráfico de Barras - Agrega esto HERE */}
                 <h2 className="sub-header">Gráfico de Barras - Ventas por Tipo</h2>
                <div className="chart-container">
                    <Bar data={barChartData} />
                </div>

                {/* Gráfico de Líneas - Agrega esto HERE */}
                <h2 className="sub-header">Gráfico de Líneas - Ganancias</h2>
                <div className="chart-container">
                    <Line data={lineChartData} />
                </div>

                {/* Gráfico de Dispersión - Agrega esto HERE */}
                <h2 className="sub-header">Gráfico de Dispersión - Ventas vs Inversión</h2>
                <div className="chart-container">
                    <Scatter data={scatterChartData} />
                </div>

                 {/* Gráfico de Pirámide (Cascada) - Agrega esto HERE */}
                   <h2 className="sub-header">Gráfico de Pirámide (Cascada)</h2>
                <div className="chart-container">
                    <Bar
                        data={pyramidChartData}
                        options={{
                            plugins: {
                                legend: { display: true }
                            },
                            scales: {
                                x: { stacked: true },
                                y: { stacked: true }
                            }
                        }}
                    />
                </div>

                {/* Gráfico de Torta - Agrega esto HERE */}
                <h2 className="sub-header">Gráfico de Torta - Ventas por Plataforma</h2>
                <div className="chart-container">
                    <Pie data={pieChartData} />
                </div>
            </div>
        </div>
    );
}

export default StatisticsPage;