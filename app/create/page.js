// --- /app/create/page.js (con URLs de Verificación) ---
"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

const factoryABI = [{ "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "campaignAddress", "type": "address" }, { "indexed": true, "internalType": "address", "name": "developer", "type": "address" }, { "indexed": false, "internalType": "string", "name": "name", "type": "string" }], "name": "CampaignCreated", "type": "event" }, { "inputs": [{ "internalType": "string", "name": "_name", "type": "string" }, { "internalType": "string", "name": "_description", "type": "string" }, { "internalType": "string", "name": "_githubUrl", "type": "string" }, { "internalType": "uint256", "name": "_fundingGoal", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }, { "internalType": "string[]", "name": "_milestoneDescriptions", "type": "string[]" }, { "internalType": "uint256[]", "name": "_milestoneAmounts", "type": "uint256[]" }, { "internalType": "string[]", "name": "_milestoneUrls", "type": "string[]" }], "name": "createCampaign", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "getDeployedCampaigns", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }], "stateMutability": "view", "type": "function" }];

export default function CreateCampaignPage() {
    const [isClient, setIsClient] = useState(false);
    const { isConnected } = useAccount();
    const [formData, setFormData] = useState({ name: '', description: '', githubUrl: '', goal: '', deadline: '' });
    const [milestones, setMilestones] = useState([{ description: '', amount: '', verificationUrl: '' }]);

    const { data: hash, isPending, writeContract } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

    useEffect(() => { setIsClient(true); }, []);

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleMilestoneChange = (index, field, value) => {
        const newMilestones = [...milestones];
        newMilestones[index][field] = value;
        setMilestones(newMilestones);
    };
    const addMilestone = () => setMilestones([...milestones, { description: '', amount: '', verificationUrl: '' }]);
    const removeMilestone = (index) => setMilestones(milestones.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isConnected) return alert("Por favor, conecta tu wallet primero.");

        const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
        const milestoneDescriptions = milestones.map(m => m.description);
        const milestoneAmounts = milestones.map(m => parseEther(m.amount || '0'));
        const milestoneUrls = milestones.map(m => m.verificationUrl);

        writeContract({
            address: process.env.NEXT_PUBLIC_FACTORY_ADDRESS,
            abi: factoryABI,
            functionName: 'createCampaign',
            args: [
                formData.name, formData.description, formData.githubUrl,
                parseEther(formData.goal), BigInt(deadlineTimestamp),
                milestoneDescriptions, milestoneAmounts, milestoneUrls
            ],
        });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center text-slate-800">Lanza tu Propia Campaña</h1>
            {isClient && isConnected && (
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nombre del Proyecto</label>
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="githubUrl" className="block text-sm font-medium text-slate-700 mb-1">URL del Repositorio de GitHub</label>
                            <input type="url" name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} required placeholder="https://github.com/usuario/repo" className="w-full p-3 border border-slate-300 rounded-lg" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" className="w-full p-3 border border-slate-300 rounded-lg"></textarea>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="goal" className="block text-sm font-medium text-slate-700 mb-1">Meta de Financiación (ETH)</label>
                                <input type="number" name="goal" value={formData.goal} onChange={handleInputChange} required step="0.01" min="0" className="w-full p-3 border border-slate-300 rounded-lg" />
                            </div>
                            <div>
                                <label htmlFor="deadline" className="block text-sm font-medium text-slate-700 mb-1">Fecha Límite</label>
                                <input type="date" name="deadline" value={formData.deadline} onChange={handleInputChange} required className="w-full p-3 border border-slate-300 rounded-lg" />
                            </div>
                        </div>
                    </div>
                    <hr className="border-slate-200" />
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-800">Hitos Iniciales</h3>
                        {milestones.map((milestone, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border">
                                <span className="font-bold text-slate-400 mt-2">{index + 1}</span>
                                <div className="flex-grow space-y-2">
                                    <input type="text" placeholder="Descripción del hito" value={milestone.description} onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)} required className="w-full p-2 border border-slate-300 rounded-md" />
                                    <input type="number" placeholder="Recompensa en ETH" value={milestone.amount} onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)} required step="0.01" min="0" className="w-full p-2 border border-slate-300 rounded-md" />
                                    <input type="url" placeholder="URL de Verificación (ej. GitHub PR)" value={milestone.verificationUrl} onChange={(e) => handleMilestoneChange(index, 'verificationUrl', e.target.value)} required className="w-full p-2 border border-slate-300 rounded-md" />
                                </div>
                                {milestones.length > 1 && <button type="button" onClick={() => removeMilestone(index)} className="text-red-500 hover:text-red-700 font-bold text-2xl mt-1">&times;</button>}
                            </div>
                        ))}
                        <button type="button" onClick={addMilestone} className="w-full text-sm font-semibold text-indigo-600 hover:text-indigo-800 py-2 rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-400">
                            + Añadir otro Hito
                        </button>
                    </div>
                    <button type="submit" disabled={isPending || isConfirming} className="w-full btn bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400">
                        Crear Campaña con Hitos
                    </button>
                </form>
            )}
        </div>
    );
}
