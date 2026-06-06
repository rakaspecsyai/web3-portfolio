'use client'

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { erc20Abi } from '../abi'
import { formatUnits, parseUnits } from 'viem'

export function TokenBalance({ tokenAddress, userAddress }) {
    //membaca saldo token
    const { data: balance, isLoading: isBalanceLoading } = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [userAddress],
        query: {
            enabled: !!userAddress,
        }
    })

    // 2. membaca simbol token (misal: USDT, USDC)
    const { data: symbol } = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'symbol',
    })

    // 3. membaca desimal token untuk konversi matematika yang akurat
    const { data: decimals } = useReadContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'decimals',
    })

    //Logika write contract untuk melakukan transaksi (misal: transfer token)
    const { data: hash, isPending, writeContract } = useWriteContract()
    //hook ini akan memantau status transaksi berdasarkan hash yang dihasilkan dari writeContract
    const { isLoading: isConfirming, isSuccess:isConfirmed } = useWaitForTransactionReceipt({
        hash,
    })

    //fungsi eksekusi saat tombol ditekan
    const handleApprove = () => {
        writeContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'approve',
            //Argumen: [Alat tujuan dummy dan jumlah token yang ingin disetujui (dalam format desimal)]
            args: ['0x1111111111111111111111111111111111111111', parseUnits('10', decimals || 6)], // ganti dengan alamat penerima dan jumlah yang diinginkan
        })
    }

    if (isBalanceLoading) return <div className="text-yellow-400 text-sm animate-pulse">Memuat data kontrak...</div>

    // mengubah format angka mentah blockchain (BigInt) menjadi angka desimal yang bisa dibaca manusia
    const formattedBalance = balance !== undefined && decimals !== undefined
        ? formatUnits(balance, decimals)
        : '0'
        
    return (
        <div className="flex flex-col gap-3 bg-gray-900 p-4 rounded-lg border border-gray-700 mt-2">
            <div className="flex justify-between items-center">
                <span className="font-medium text-gray-300">Token {symbol || 'Unknown'}:</span>
                <span className="font-bold text-white">{Number(formattedBalance).toFixed(2)}</span>
            </div>

            {/* tombol eksekusi transaksi */}
            <button
                onClick={handleApprove}
                disabled={isPending || isConfirming}
                className={`w-full py-2 rounded-md font-bold text-sm transition-all ${
                    isPending || isConfirming 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-indigo-700 text-white shadow-lg'
                }`}
            >
                { isPending ? 'Menunggu Konfirmasi Dompet...' :
                 isConfirming ? 'Transaksi Diproses Blockchain' :
                 isConfirmed ? 'Approve Berhasil!' :
                 `Approve 10 ${symbol || 'Token'}`}
            </button>

            
            {hash && (
                <a
                    href={`https://sepolia.etherscan.io/tx/${hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 text-center hover:underline mt-1"
                >
                    Lihat Transaksi di Etherscan
                </a>
            )}
        </div>
        
    )

}