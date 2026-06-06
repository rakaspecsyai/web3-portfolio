'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'
import { TokenBalance } from './TokenBalance'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()
  const USDC_SEPOLIA = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'

  // 1. Ambil data saldo berdasarkan alamat wallet yang terhubung
  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: address,

    //  konfigurasi React Query untuk menyegarkan data saldo
    query: {
      staleTime: 10000, // Refresh setiap 10 detik
      refetchOnWindowFocus: false, // Refresh saat jendela tidak aktif
    },
    
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-8">Memuat DApp...</h1>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Web3 Portfolio Tracker</h1>

      {isConnected ? (
        // UI Dashboard Portfolio Kreatif & Profesional
        <div className="flex flex-col items-center gap-6 bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 min-w-[350px]">
          <div className="flex items-center gap-2 text-green-400 font-bold text-sm bg-green-500/10 px-3 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            Connected
          </div>
          
          {/* Tampilan Alamat Wallet */}
          <div className="w-full text-center">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Wallet Address</p>
            <p className="bg-gray-900 p-3 rounded-lg mt-1 font-mono text-xs break-all text-gray-300 select-all border border-gray-700">
              {address}
            </p>
          </div>

          {/* Tampilan Saldo Kripto Real-Time */}
          <div className="w-full text-center border-t border-b border-gray-700 py-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Balance</p>
            {isBalanceLoading ? (
              <p className="text-lg font-medium text-yellow-400 mt-1 animate-pulse">Menghubungi Blockchain...</p>
            ) : (
              <p className="text-3xl font-black text-blue-400 mt-1 tracking-tight">
                {/* Menggunakan Ternary operator sebagai jaring  pengaman */}
                {balance?.formatted ? Number(balance?.formatted).toFixed(4) : '0.0000'} 
                <span className="text-xl text-white font-medium">
                  {balance?.symbol || ' ETH'}
                </span>
              </p>
            )}
          </div>

          {/* integrasi pembacaan Smart Contract Token */}
          <div className="w-full text-left mb-4">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-2 border-b border-gray-700 pb-1">
              Aset Token
            </p>
            <TokenBalance tokenAddress={USDC_SEPOLIA} userAddress={address} />
          </div>

          <button
            onClick={() => disconnect()}
            className="w-full px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg font-bold transition-all text-sm shadow-lg shadow-red-900/20"
          >
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-all shadow-lg shadow-blue-500/10 text-sm tracking-wide"
            >
              Connect {connector.name}
            </button>
          ))}
        </div>
      )}
    </main>
  )
}