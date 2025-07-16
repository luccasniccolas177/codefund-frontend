// --- /app/projects/[campaign_address]/page.js (con Panel de Desarrollador) ---
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

const campaignABI = [{ "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "string", "name": "_description", "type": "string" }, { "internalType": "uint256", "name": "_fundingGoal", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }, { "internalType": "address", "name": "_developer", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "contributor", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "Contribution", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "milestoneId", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "description", "type": "string" }], "name": "MilestoneCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "milestoneId", "type": "uint256" }], "name": "MilestoneApproved", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "milestoneId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "FundsReleased", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_milestoneId", "type": "uint256" }], "name": "approveMilestone", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "contribute", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "contributions", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "contributorCount", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_description", "type": "string" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "createMilestone", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "deadline", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "description", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "developer", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "fundingGoal", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getCampaignDetails", "outputs": [{ "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getMilestones", "outputs": [{ "components": [{ "internalType": "string", "name": "description", "type": "string" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bool", "name": "verified", "type": "bool" }, { "internalType": "bool", "name": "fundsReleased", "type": "bool" }], "internalType": "struct Campaign.Milestone[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "milestones", "outputs": [{ "internalType": "string", "name": "description", "type": "string" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bool", "name": "verified", "type": "bool" }, { "internalType": "bool", "name": "fundsReleased", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_milestoneId", "type": "uint256" }], "name": "releaseMilestoneFunds", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "totalRaised", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];

export default function ProjectPage() {
    const params = useParams();
    const campaign_address = params.campaign_address;

    const [isClient, setIsClient] = useState(false);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contributionAmount, setContributionAmount] = useState('');
    const [newMilestone, setNewMilestone] = useState({ description: '', amount: '' });

    const { address: userAddress, isConnected } = useAccount();
    const { data: hash, isPending, writeContract, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    const fetchProjectDetails = async (address) => {
        setLoading(true);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/projects/${address}`);
            if (!response.ok) throw new Error('Proyecto no encontrado');
            const data = await response.json();
            setProject(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsClient(true);
        if (campaign_address) {
            fetchProjectDetails(campaign_address);
        }
    }, [campaign_address]);

    useEffect(() => {
        if (isConfirmed) {
            // Después de cualquier transacción exitosa, reseteamos el estado y recargamos los datos.
            reset();
            setNewMilestone({ description: '', amount: '' });
            setContributionAmount('');
            if (campaign_address) {
                fetchProjectDetails(campaign_address);
            }
        }
    }, [isConfirmed, campaign_address, reset]);

    const handleContribute = (e) => {
        e.preventDefault();
        writeContract({
            address: campaign_address, abi: campaignABI, functionName: 'contribute',
            value: parseEther(contributionAmount)
        });
    };

    const handleCreateMilestone = (e) => {
        e.preventDefault();
        writeContract({
            address: campaign_address, abi: campaignABI, functionName: 'createMilestone',
            args: [newMilestone.description, parseEther(newMilestone.amount)]
        });
    };

    const handleApproveMilestone = (milestoneIndex) => {
        writeContract({
            address: campaign_address, abi: campaignABI, functionName: 'approveMilestone',
            args: [milestoneIndex]
        });
    };

    const handleReleaseFunds = (milestoneIndex) => {
        writeContract({
            address: campaign_address, abi: campaignABI, functionName: 'releaseMilestoneFunds',
            args: [milestoneIndex]
        });
    };

    if (!isClient || loading) return <p className="text-center text-slate-500 mt-10">Cargando detalles del proyecto...</p>;
    if (error) return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
    if (!project) return <p className="text-center mt-10">No se encontró el proyecto.</p>;

    const progress = (project.total_raised_eth / project.funding_goal_eth) * 100;
    const isDeveloper = isConnected && userAddress?.toLowerCase() === project.developer_address?.toLowerCase();
    const fundingGoalReached = project.total_raised_eth >= project.funding_goal_eth;

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">{project.name}</h1>
                <p className="text-sm text-slate-500">Desarrollador: <span className="font-mono text-indigo-600">{project.developer_address}</span></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                        <h3 className="font-bold text-xl mb-4 text-slate-700">Descripción del Proyecto</h3>
                        <p className="text-slate-600 leading-relaxed">{project.description}</p>
                    </div>

                    {/* PANEL DE DESARROLLADOR */}
                    {isDeveloper && (
                        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                            <h3 className="font-bold text-xl mb-4 text-slate-700">Panel de Desarrollador</h3>
                            {!fundingGoalReached ? (
                                <p className="text-sm text-amber-700 bg-amber-100 p-3 rounded-md">Debes alcanzar la meta de financiación para poder añadir hitos.</p>
                            ) : (
                                <form onSubmit={handleCreateMilestone} className="space-y-4">
                                    <h4 className="font-semibold text-slate-600">Añadir Nuevo Hito</h4>
                                    <div>
                                        <input type="text" placeholder="Descripción del hito" value={newMilestone.description} onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })} required className="w-full p-2 border border-slate-300 rounded-lg" />
                                    </div>
                                    <div>
                                        <input type="number" placeholder="Recompensa en ETH" value={newMilestone.amount} onChange={(e) => setNewMilestone({ ...newMilestone, amount: e.target.value })} required step="0.01" min="0" className="w-full p-2 border border-slate-300 rounded-lg" />
                                    </div>
                                    <button type="submit" disabled={isPending || isConfirming} className="w-full btn bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400">
                                        Crear Hito
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
                        <h3 className="font-bold text-xl mb-6 text-slate-700">Hitos del Proyecto</h3>
                        <div className="space-y-4">
                            {project.milestones.length > 0 ? project.milestones.map((milestone, index) => (
                                <div key={index} className="border-l-4 p-4 rounded-r-lg bg-slate-50" style={{ borderColor: milestone.funds_released ? '#10B981' : milestone.verified ? '#3B82F6' : '#F59E0B' }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-slate-800">{milestone.description}</p>
                                            <p className="text-sm text-slate-500">Recompensa: {milestone.amount_eth} ETH</p>
                                        </div>
                                        <div className="flex flex-col items-end space-y-2 flex-shrink-0 ml-4">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${milestone.funds_released ? 'bg-green-100 text-green-800' : milestone.verified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {milestone.funds_released ? 'Pagado' : milestone.verified ? 'Verificado' : 'Pendiente'}
                                            </span>
                                            {isDeveloper && !milestone.funds_released && (
                                                <div className="flex gap-2">
                                                    {!milestone.verified && <button onClick={() => handleApproveMilestone(index)} disabled={isPending || isConfirming} className="btn text-xs bg-slate-500 text-white py-1 px-2 rounded hover:bg-slate-600 disabled:bg-slate-300">Aprobar</button>}
                                                    {milestone.verified && <button onClick={() => handleReleaseFunds(index)} disabled={isPending || isConfirming} className="btn text-xs bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 disabled:bg-slate-300">Liberar</button>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-500">El desarrollador aún no ha definido hitos para este proyecto.</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 sticky top-24">
                        <h3 className="font-bold text-lg mb-4 text-slate-700">Progreso de Financiación</h3>
                        <div className="flex justify-between items-baseline text-2xl font-bold mb-2"><span className="text-indigo-600">{project.total_raised_eth.toFixed(4)} ETH</span><span className="text-slate-400 text-lg">/ {project.funding_goal_eth} ETH</span></div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4"><div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
                        <div className="space-y-2 text-sm text-slate-600"><p><strong>{project.contributor_count}</strong> Patrocinadores</p><p><strong>{project.days_left}</strong> días restantes</p></div>
                        <hr className="my-6 border-slate-200" />
                        <h3 className="font-bold text-lg mb-4 text-slate-700">Patrocinar</h3>
                        {isClient && (
                            <div>
                                {isConnected ? (
                                    <form onSubmit={handleContribute}>
                                        <input type="number" value={contributionAmount} onChange={(e) => setContributionAmount(e.target.value)} placeholder="0.1 ETH" step="0.01" min="0" required className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500" />
                                        <button type="submit" disabled={isPending || isConfirming} className="w-full btn bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:bg-slate-400 transition-all">
                                            {isPending ? 'Enviando...' : isConfirming ? 'Confirmando...' : 'Contribuir'}
                                        </button>
                                    </form>
                                ) : (
                                    <p className="text-center text-sm text-slate-600">Conecta tu wallet para contribuir.</p>
                                )}
                                {hash && <p className="text-xs text-blue-600 mt-2 truncate">Hash: {hash}</p>}
                                {isConfirmed && <p className="text-sm text-green-600 mt-2 font-semibold">¡Transacción exitosa!</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
