"use client";

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { erc721Abi } from '../../abi'; 

// Alamat Smart Contract yang baru di-deploy
const NFT_CONTRACT_ADDRESS = '0xfED34dD2A4E594B8e690A08bC6406dAe05630015';

export default function MintPage() {
    // Pelindung Hydration Error
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const { isConnected } = useAccount();

    const { data: totalSupply } = useReadContract({
        address: NFT_CONTRACT_ADDRESS,
        abi: erc721Abi,
        functionName: 'totalSupply',
    });

    const { data: hash, writeContract, isPending, error } = useWriteContract();

    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const handleMint = () => {
        writeContract({
            address: NFT_CONTRACT_ADDRESS,
            abi: erc721Abi,
            functionName: 'mint',
        });
    };

    // Tunda render sampai browser siap
    if (!mounted) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 font-sans">
            <div className="w-full max-w-md p-8 bg-white border border-gray-200 shadow-sm rounded-xl">
                
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-black tracking-tight">Zac Washing VIP</h1>
                    <p className="mt-2 text-sm text-gray-500 font-medium">
                        Akses Keanggotaan Eksklusif Premium Restorasi Sepatu.
                    </p>
                </div>

                <div className="flex justify-between items-center px-4 py-3 mb-6 bg-gray-100 rounded-lg">
                    <span className="text-sm font-bold text-gray-800">Total Terbit:</span>
                    <span className="text-lg font-black text-orange-500">
                        {totalSupply ? Number(totalSupply).toString() : '0'} / 500
                    </span>
                </div>

                {!isConnected ? (
                    <p className="text-center text-sm text-red-500 font-bold mb-4">
                        Silakan kembali ke dashboard utama untuk menghubungkan dompet Anda terlebih dahulu.
                    </p>
                ) : (
                    <button
                        onClick={handleMint}
                        disabled={isPending || isConfirming}
                        className={`w-full py-3 rounded-lg font-black text-white uppercase tracking-wider transition-all duration-300 ${
                            isPending || isConfirming
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-orange-500 hover:bg-orange-600 shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)]'
                        }`}
                    >
                        {isPending ? 'Meminta Tanda Tangan...' : isConfirming ? 'Mencetak ke Blockchain...' : 'Mint VIP Pass'}
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                              <p className="text-xs text-red-600 break-words">{error.message}</p>
                            </div>
                        )}
                    </button>
                )}

                {isSuccess && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-center">
                        <p className="text-xs font-bold text-green-600">
                            🎉 Minting Berhasil! VIP Pass ada di dompet Anda.
                        </p>
                    </div>
                )}
                
            </div>
        </div>
    );
}