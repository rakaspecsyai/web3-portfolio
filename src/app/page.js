"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { TokenBalance } from './TokenBalance';

export default function Home() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const { address, isConnected } = useAccount();
    const { connectors, connect } = useConnect();
    const { disconnect } = useDisconnect();

    const { data: balance } = useBalance({
        address: address,
        query: {
            staleTime: 10_000,
            refetchOnWindowFocus: false,
        }
    });

    if (!mounted) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
            <div className="w-full max-w-md p-8 bg-white border border-gray-200 shadow-sm rounded-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-black tracking-tight">Web3 Dashboard</h1>
                    <p className="mt-2 text-sm text-gray-500 font-medium">Kelola portofolio terdesentralisasi Anda.</p>
                </div>

                {!isConnected ? (
                    <div className="space-y-3">
                        {connectors.map((connector) => (
                            <button
                                key={connector.uid}
                                onClick={() => connect({ connector })}
                                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-all shadow-md"
                            >
                                Connect {connector.name}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Card Saldo & Address */}
                        <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
                            <p className="text-sm font-bold text-gray-800 mb-1">Alamat Wallet:</p>
                            <p className="text-xs text-gray-600 break-all mb-4">{address}</p>

                            <p className="text-sm font-bold text-gray-800 mb-1">Saldo ETH:</p>
                            <p className="text-2xl font-black text-orange-500">
                                {balance?.formatted ? Number(balance.formatted).toFixed(4) : '0.0000'} ETH
                            </p>
                        </div>

                        {/* Eksekusi Smart Contract USDC */}
                        <TokenBalance />

                        {/* Tombol Navigasi ke Halaman Minting */}
                        <Link href="/mint" className="block w-full text-center py-3 bg-black text-white rounded-lg font-bold uppercase tracking-wider hover:bg-gray-800 transition-all shadow-md">
                            Buka Halaman Minting NFT 🚀
                        </Link>

                        <button
                            onClick={() => disconnect()}
                            className="w-full py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg font-bold transition-all"
                        >
                            Disconnect Wallet
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}