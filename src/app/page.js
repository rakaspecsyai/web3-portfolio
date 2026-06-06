'use client'

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi'
import { useState, useEffect } from 'react'
import { TokenBalance } from './TokenBalance'

export default function Home() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

  const USDC_SEPOLIA = '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    address: address,
    query: {
      staleTime: 10000, // 10 detik
      refetchOnWindowFocus: false,
    }
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-white text-black">
        <h1 className="text-xl font-bold mb-8 animate-pulse text-gray-400">Memuat Antarmuka...</h1>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white text-black font-sans">
      <div className="w-full max-w-md">
        {/* Header Estetik */}
        <h1 className="text-4xl font-black mb-8 text-center tracking-tight">
          Web3 <span className="text-orange-500">Portfolio</span>
        </h1>

        {isConnected ? (
          // Desain Berbasis Card Utama
          <div className="flex flex-col gap-6 bg-white p-7 rounded-2xl border border-gray-200 shadow-sm">
            
            {/* Status Terhubung (Aksen Oranye) */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Status</span>
              <div className="flex items-center gap-2 text-orange-600 font-bold text-xs bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                Connected
              </div>
            </div>
            
            {/* Kartu Alamat Wallet */}
            <div className="w-full">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Wallet Address</p>
              <p className="bg-gray-50 p-3 rounded-xl font-mono text-xs break-all text-gray-600 select-all border border-gray-100">
                {address}
              </p>
            </div>

            {/* Kartu Saldo Utama */}
            <div className="w-full border-t border-b border-gray-100 py-6 my-2">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Total Balance</p>
              {isBalanceLoading ? (
                <p className="text-sm font-medium text-gray-400 mt-1 animate-pulse">Sinkronisasi Blockchain...</p>
              ) : (
                <p className="text-5xl font-black text-black tracking-tighter">
                  {balance?.formatted ? Number(balance.formatted).toFixed(4) : '0.0000'} 
                  <span className="text-xl text-orange-500 font-bold ml-2 uppercase">
                    {balance?.symbol || 'ETH'}
                  </span>
                </p>
              )}
            </div>

            {/* Area Aset Token */}
            <div className="w-full">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                Aset Token Kontrak
              </p>
              <TokenBalance tokenAddress={USDC_SEPOLIA} userAddress={address} />
            </div>

            {/* Tombol Disconnect (Gaya Garis Tepi/Outline Minimalis) */}
            <button
              onClick={() => disconnect()}
              className="w-full mt-2 px-6 py-3 bg-white border-2 border-black text-black hover:bg-black hover:text-white rounded-xl font-bold transition-all text-sm uppercase tracking-wide"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          // Layar Login/Connect Berbasis Card
          <div className="flex flex-col gap-5 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm text-center">
            <p className="text-gray-500 text-sm mb-2 font-medium">Otorisasi dompet Anda untuk mengakses portofolio aset terdesentralisasi.</p>
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="w-full px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 text-sm uppercase tracking-wider"
              >
                Connect {connector.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}