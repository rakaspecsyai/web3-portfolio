'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi } from '../abi'
import { formatUnits, parseUnits } from 'viem'

export function TokenBalance({ tokenAddress, userAddress }) {
  const { data: balance, isLoading: isBalanceLoading } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [userAddress],
    query: { enabled: !!userAddress }
  })

  const { data: symbol } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'symbol',
  })

  const { data: decimals } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'decimals',
  })

  const { data: hash, isPending, writeContract } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  const handleApprove = () => {
    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: ['0x1111111111111111111111111111111111111111', parseUnits('10', decimals || 6)],
    })
  }

  if (isBalanceLoading) return <div className="text-gray-400 text-xs animate-pulse font-medium">Sinkronisasi kontrak...</div>

  const formattedBalance = balance !== undefined && decimals !== undefined 
    ? formatUnits(balance, decimals) 
    : '0'

  return (
    // Sub-Card untuk Token
    <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
      <div className="flex justify-between items-center">
        <span className="font-bold text-gray-500 text-sm">{symbol || 'Unknown'}</span>
        <span className="font-black text-black text-xl">{Number(formattedBalance).toFixed(2)}</span>
      </div>

      {/* Tombol Eksekusi Beraksen Oranye */}
      <button
        onClick={handleApprove}
        disabled={isPending || isConfirming}
        className={`w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
          isPending || isConfirming 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20'
        }`}
      >
        {isPending ? 'Menunggu Konfirmasi...' : 
         isConfirming ? 'Diproses Blockchain...' : 
         isConfirmed ? 'Approve Berhasil! ✅' : 
         `Approve 10 ${symbol || 'Token'}`}
      </button>

      {hash && (
        <a 
          href={`https://sepolia.etherscan.io/tx/${hash}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] text-orange-500 font-bold text-center hover:text-orange-700 hover:underline uppercase tracking-widest mt-1"
        >
          Lihat di Etherscan
        </a>
      )}
    </div>
  )
}