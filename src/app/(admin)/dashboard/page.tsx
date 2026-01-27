'use client';

import { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { getMonthlySalesStats } from '@/service/facturaDP';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function DashboardPage() {
    const [chartData, setChartData] = useState<any>({
        labels: [],
        datasets: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Reporte de Ventas Mensuales',
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label + ' (Total facturado en el mes)';
                    }
                }
            }
        },
    };

    useEffect(() => {
        const loadStats = async () => {
            const token = localStorage.getItem('token') || undefined;
            const res = await getMonthlySalesStats(token);

            if (res.success && res.data) {
                // res.data should be [{ MES: '2024-05', TOTAL: 1200 }, ...]
                const labels = res.data.map((item: any) => item.MES);
                const values = res.data.map((item: any) => item.TOTAL);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Ventas ($)',
                            data: values,
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                    ],
                });
            }
            setIsLoading(false);
        };
        loadStats();
    }, []);

    if (isLoading) return <div className="p-5 text-center">Cargando reporte...</div>;

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4 text-primary fw-bold">Dashboard Administrativo</h2>

            <div className="row">
                <div className="col-12 col-lg-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h5 className="card-title text-muted mb-4">Ventas Mensuales</h5>
                            <div style={{ height: '400px' }}>
                                <Bar options={options} data={chartData} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-4">
                    <div className="card shadow-sm border-0 mb-4 bg-primary text-white">
                        <div className="card-body">
                            <h5 className="card-title">Resumen Rápido</h5>
                            <p className="card-text opacity-75">Indicadores clave de rendimiento</p>
                        </div>
                    </div>

                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="fw-bold mb-3">Acciones Rápidas</h6>
                            <div className="d-grid gap-2">
                                <button className="btn btn-outline-dark text-start text-white">
                                    <i className="fa-solid fa-file-invoice me-2 text-white"></i>Generar Reporte PDF
                                </button>
                                <button className="btn btn-outline-dark text-start text-white">
                                    <i className="fa-solid fa-users me-2 text-white"></i>Gestionar Usuarios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
