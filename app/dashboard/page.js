// --- /app/dashboard/page.js ---
"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import ProjectCard from '../../components/ProjectCard';

export default function DashboardPage() {
    const [isClient, setIsClient] = useState(false);
    const { address, isConnected } = useAccount();

    const [createdCampaigns, setCreatedCampaigns] = useState([]);
    const [contributedCampaigns, setContributedCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setIsClient(true);

        const fetchDashboardData = async () => {
            if (!isConnected || !address) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Hacemos las dos llamadas a la API de forma concurrente para mayor eficiencia
                const [createdRes, contributedRes] = await Promise.all([
                    fetch(`http://127.0.0.1:8000/api/v1/users/${address}/created`),
                    fetch(`http://127.0.0.1:8000/api/v1/users/${address}/contributed`)
                ]);

                if (!createdRes.ok || !contributedRes.ok) {
                    throw new Error("Error al obtener los datos del dashboard desde la API.");
                }

                const createdData = await createdRes.json();
                const contributedData = await contributedRes.json();

                setCreatedCampaigns(createdData);
                setContributedCampaigns(contributedData);

            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [isConnected, address]);

    if (!isClient) return null; // Evita renderizado en servidor que no coincide con el cliente

    if (!isConnected) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-slate-700 mb-4">Panel de Usuario</h1>
                <p className="text-slate-500">Por favor, conecta tu wallet para ver tu dashboard personalizado.</p>
            </div>
        );
    }

    if (loading) {
        return <p className="text-center text-slate-500 mt-10">Cargando tu información...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
    }

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Mis Campañas Creadas</h2>
                {createdCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {createdCampaigns.map(project => (
                            <ProjectCard key={project.campaign_address} project={{ ...project, id: project.campaign_address }} />
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 bg-white p-6 rounded-lg border border-slate-200">Aún no has creado ninguna campaña. <Link href="/create" className="text-indigo-600 font-semibold hover:underline">¡Lanza la primera!</Link></p>
                )}
            </div>

            <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Mis Contribuciones</h2>
                {contributedCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {contributedCampaigns.map(project => (
                            <ProjectCard key={project.campaign_address} project={{ ...project, id: project.campaign_address }} />
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 bg-white p-6 rounded-lg border border-slate-200">No has contribuido a ninguna campaña todavía. <Link href="/discover" className="text-indigo-600 font-semibold hover:underline">Explora proyectos para apoyar.</Link></p>
                )}
            </div>
        </div>
    );
}
