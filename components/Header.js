// --- /components/Header.js (Corregido para evitar Hydration Error) ---
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

function WalletConnectButton() {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const shortAddress = (addr) => addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';

    if (isConnected) {
        return (
            <div className="flex items-center gap-4">
                <span className="hidden sm:block bg-white p-2 rounded-lg shadow-sm border text-sm font-mono text-indigo-600">{shortAddress(address)}</span>
                <button onClick={() => disconnect()} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all">
                    Desconectar
                </button>
            </div>
        );
    }

    return (
        <button onClick={() => connect({ connector: injected() })} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 transition-all">
            Conectar Wallet
        </button>
    );
}

export default function Header() {
    const { isConnected } = useAccount();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <header className="bg-white shadow-md sticky top-0 z-50 border-b border-slate-200">
            <nav className="container mx-auto flex justify-between items-center p-4">
                <Link href="/" className="text-3xl font-bold text-slate-800">
                    Code<span className="text-indigo-600">Fund</span>
                </Link>
                <div className="flex items-center gap-4 md:gap-6">
                    <Link href="/discover" className="text-slate-600 hover:text-indigo-600 font-medium">
                        Descubrir
                    </Link>
                    <Link href="/create" className="text-slate-600 hover:text-indigo-600 font-medium">
                        Crear
                    </Link>
                    {/* Renderizamos el enlace al Dashboard solo en el cliente y si está conectado */}
                    {isClient && isConnected && (
                        <Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium">
                            Dashboard
                        </Link>
                    )}
                    {isClient && <WalletConnectButton />}
                </div>
            </nav>
        </header>
    );
}
