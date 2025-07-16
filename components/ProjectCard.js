// --- /components/ProjectCard.js (Corregido para usar developer_address) ---
import Link from 'next/link';

export default function ProjectCard({ project }) {
    const raised = parseFloat(project.raised) || 0;
    const goal = parseFloat(project.goal) || 1;
    const progress = Math.min((raised / goal) * 100, 100);

    // Usamos la propiedad correcta 'developer_address' que viene de la API
    const developerAddress = project.developer_address || project.developer || '';

    return (
        <Link href={`/projects/${project.id}`}>
            <div className="bg-white rounded-xl shadow-md border border-slate-200 cursor-pointer hover:border-indigo-400 transition-all h-full flex flex-col transform hover:-translate-y-1 hover:shadow-lg">
                <div className="p-6 flex-grow">
                    <h3 className="text-xl font-bold mb-2 text-slate-800">{project.name}</h3>
                    <p className="text-sm text-slate-600 mb-4 h-16 overflow-hidden">{project.description}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-b-xl border-t border-slate-200">
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1 font-semibold">
                            <span className="text-indigo-600">{raised.toFixed(2)} ETH</span>
                            <span className="text-slate-500">{goal.toFixed(2)} ETH</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1 text-slate-500">
                            <span>Recaudado</span>
                            <span>Meta</span>
                        </div>
                    </div>
                    {/* Corregimos la propiedad y añadimos una comprobación de seguridad */}
                    <p className="text-xs text-slate-500">Desarrollador: <span className="font-mono">{developerAddress.slice(0, 10)}...</span></p>
                    <p className="text-xs text-slate-500">Finaliza: <span className="font-semibold">{project.deadline}</span></p>
                </div>
            </div>
        </Link>
    );
}
