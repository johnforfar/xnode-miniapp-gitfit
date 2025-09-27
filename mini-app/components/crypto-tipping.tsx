"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CryptoWallet {
  address: string;
  chainId: number;
  isConnected: boolean;
}

interface TippingProps {
  ownerWalletAddress: string;
}

export default function CryptoTipping({ ownerWalletAddress }: TippingProps) {
  const [wallet, setWallet] = useState<CryptoWallet | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");
  const [selectedToken, setSelectedToken] = useState("eth");
  const [tipAmount, setTipAmount] = useState(0.01);
  const [isSending, setIsSending] = useState(false);

  // Check if wallet is already connected
  useEffect(() => {
    const checkWalletConnection = () => {
      if (typeof window !== "undefined" && window.ethereum) {
        const address = localStorage.getItem("wallet_address");
        const chainId = localStorage.getItem("wallet_chain_id");
        
        if (address && chainId) {
          setWallet({
            address,
            chainId: parseInt(chainId),
            isConnected: true,
          });
        }
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      alert("Please install MetaMask or another Web3 wallet!");
      return;
    }

    setIsConnecting(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // Get chain ID
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      const walletData: CryptoWallet = {
        address: accounts[0],
        chainId: parseInt(chainId, 16),
        isConnected: true,
      };

      setWallet(walletData);
      
      // Store in localStorage
      localStorage.setItem("wallet_address", accounts[0]);
      localStorage.setItem("wallet_chain_id", chainId);
      
      console.log("Wallet connected:", walletData);
      
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      alert(`Wallet connection failed: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    localStorage.removeItem("wallet_address");
    localStorage.removeItem("wallet_chain_id");
  };

  const switchNetwork = async (network: string) => {
    if (!window.ethereum) return;

    const networkConfigs = {
      ethereum: { chainId: "0x1", chainName: "Ethereum Mainnet" },
      base: { chainId: "0x2105", chainName: "Base Mainnet" },
      bnb: { chainId: "0x38", chainName: "BNB Smart Chain" },
      polygon: { chainId: "0x89", chainName: "Polygon Mainnet" },
    };

    const config = networkConfigs[network as keyof typeof networkConfigs];
    if (!config) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: config.chainId }],
      });
    } catch (error: any) {
      // If chain doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: config.chainId,
                chainName: config.chainName,
                rpcUrls: ["https://rpc.ankr.com/eth"], // Default RPC
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add network:", addError);
        }
      }
    }
  };

  const sendTip = async () => {
    if (!wallet || !window.ethereum) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsSending(true);

    try {
      // Convert amount to wei (assuming ETH for now)
      const amountInWei = (tipAmount * Math.pow(10, 18)).toString(16);
      
      // Send transaction
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: wallet.address,
            to: ownerWalletAddress,
            value: `0x${amountInWei}`,
            gas: "0x5208", // 21000 gas for simple transfer
          },
        ],
      });

      console.log("Transaction sent:", txHash);
      alert(`Tip sent! Transaction hash: ${txHash}`);
      
    } catch (error: any) {
      console.error("Transaction failed:", error);
      alert(`Transaction failed: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const getNetworkName = (chainId: number) => {
    const networks = {
      1: "Ethereum",
      8453: "Base", 
      56: "BNB Smart Chain",
      137: "Polygon",
    };
    return networks[chainId as keyof typeof networks] || "Unknown";
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-4">
      <h4 className="font-bold text-lg text-purple-300 text-center">💰 Support My Fitness Journey</h4>
      <p className="text-purple-200 text-sm text-center">
        Every tip motivates me to keep pushing!
      </p>
      
      {/* Wallet Connection */}
      <div className="space-y-3">
        {!wallet ? (
          <Button 
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-xl"
          >
            {isConnecting ? "⏳ Connecting..." : "🔗 Connect Wallet"}
          </Button>
        ) : (
          <div className="bg-green-700/50 rounded-lg p-3 border border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-semibold text-green-200">✅ Wallet Connected</h5>
                <p className="text-green-300 text-sm">
                  {formatAddress(wallet.address)} on {getNetworkName(wallet.chainId)}
                </p>
              </div>
              <Button 
                onClick={disconnectWallet}
                variant="outline"
                size="sm"
                className="text-green-200 border-green-400 hover:bg-green-600"
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Tipping Form */}
      {wallet && (
        <div className="space-y-3">
          {/* Network Selection */}
          <div className="space-y-1">
            <label className="text-purple-300 text-xs font-medium">Network</label>
            <select 
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
              value={selectedNetwork}
              onChange={(e) => {
                setSelectedNetwork(e.target.value);
                switchNetwork(e.target.value);
              }}
            >
              <option value="ethereum">Ethereum</option>
              <option value="base">Base</option>
              <option value="bnb">BNB Smart Chain</option>
              <option value="polygon">Polygon</option>
            </select>
          </div>

          {/* Token Selection */}
          <div className="space-y-1">
            <label className="text-purple-300 text-xs font-medium">Token</label>
            <select 
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
            >
              <option value="eth">ETH</option>
              <option value="usdc">USDC</option>
              <option value="usdt">USDT</option>
              <option value="dai">DAI</option>
            </select>
          </div>

          {/* Amount Selection */}
          <div className="space-y-1">
            <label className="text-purple-300 text-xs font-medium">Amount</label>
            <div className="relative">
              <input 
                type="number" 
                step="0.01" 
                min="0.01" 
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 pr-10 text-white text-sm focus:border-purple-500 focus:outline-none"
                value={tipAmount}
                onChange={(e) => setTipAmount(parseFloat(e.target.value) || 0)}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
                {selectedToken.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Send Button */}
          <Button 
            onClick={sendTip}
            disabled={isSending || tipAmount <= 0}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-4 rounded-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
          >
            {isSending ? (
              <>
                <span className="animate-spin">⏳</span>
                <span>Sending...</span>
              </>
            ) : (
              <>
                <span>SEND TIP</span>
                <span className="text-xl">💪</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
    };
  }
}
