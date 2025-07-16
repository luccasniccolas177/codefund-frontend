// --- /app/discover/page.js (Versión Conectada) ---
"use client";

import { useState, useEffect } from 'react';
import ProjectCard from '../../components/ProjectCard';

export default function DiscoverPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Esta función ahora llama a la API de nuestro backend
        async function fetchProjects() {
            try {
                // La API del backend que está corriendo en tu máquina local
                const response = await fetch('http://127.0.0.1:8000/api/v1/projects');

                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue exitosa');
                }

                const data = await response.json();
                setProjects(data);

            } catch (err) {
                console.error("Error al obtener los proyectos:", err);
                setError("No se pudieron cargar los proyectos. Asegúrate de que el servidor del backend esté funcionando.");
            } finally {
                setLoading(false);
            }
        }

        fetchProjects();
    }, []); // El array vacío asegura que esto se ejecute solo una vez al cargar la página

    if (loading) {
        return <p className="text-center text-gray-500 mt-10">Cargando proyectos desde el backend...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Explorar Todos los Proyectos</h1>
            {projects.length === 0 ? (
                <p className="text-center text-gray-600 mt-10">
                    No se encontraron campañas. ¡Crea la primera desde el frontend principal!
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map(project => (
                        <ProjectCard
                            key={project.campaign_address}
                            project={{
                                id: project.campaign_address,
                                name: project.name,
                                description: project.description,
                                raised: project.total_raised_eth,
                                goal: project.funding_goal_eth,
                                developer: project.developer_address,
                                deadline: `${project.days_left} días restantes`
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
