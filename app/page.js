// --- /app/page.js (Página de Inicio Dinámica) ---
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from '../components/ProjectCard';

export default function HomePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/projects');
        if (!response.ok) throw new Error('Error al cargar datos');
        const data = await response.json();
        // Tomar solo los 3 primeros proyectos para la página de inicio
        setProjects(data.slice(0, 3));
      } catch (error) {
        console.error("No se pudieron cargar los proyectos destacados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <div>
      <section className="text-center py-16 md:py-24">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800">Financia el Futuro del Código Abierto.</h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Una plataforma de crowdfunding descentralizada donde los fondos se liberan
          solo cuando el código demuestra progreso real.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/discover" className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition-transform hover:scale-105">
            Explorar Proyectos
          </Link>
          <Link href="/create" className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow-lg border border-slate-200 hover:bg-slate-50 transition-transform hover:scale-105">
            Crear una Campaña
          </Link>
        </div>
      </section>

      <section className="pb-16">
        <h2 className="text-3xl font-bold mb-8 text-center text-slate-800">Proyectos Recientes</h2>
        {loading ? (
          <p className="text-center text-slate-500">Cargando proyectos...</p>
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
      </section>
    </div>
  );
}
