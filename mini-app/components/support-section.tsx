"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SupportSection() {
  const [selectedNetwork, setSelectedNetwork] = useState("Ethereum");
  const [selectedToken, setSelectedToken] = useState("ETH");
  const [amount, setAmount] = useState("0.01");

  const networks = ["Ethereum", "Base", "BNB", "Solana", "Bitcoin"];
  const tokens = {
    "Ethereum": ["ETH", "USDC", "USDT", "DAI"],
    "Base": ["ETH", "USDC", "USDT"],
    "BNB": ["BNB", "USDC", "USDT"],
    "Solana": ["SOL", "USDC", "USDT"],
    "Bitcoin": ["BTC"]
  };

  const handleSendTip = () => {
    // In a real app, this would integrate with wallet connection and blockchain transactions
    console.log(`Sending ${amount} ${selectedToken} on ${selectedNetwork}`);
    alert(`Tip sent! ${amount} ${selectedToken} on ${selectedNetwork}`);
  };

  return (
    <div className="bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-6 border border-green-700 shadow-2xl">
      <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-green-300 to-white bg-clip-text text-transparent">
        💰 Support My Fitness Journey
      </h3>
      
      <div className="space-y-4">
        {/* Network Selection */}
        <div>
          <label className="block text-green-300 text-sm font-medium mb-2">Network</label>
          <select 
            value={selectedNetwork}
            onChange={(e) => setSelectedNetwork(e.target.value)}
            className="w-full bg-green-700 border border-green-600 rounded-lg px-3 py-2 text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {networks.map((network) => (
              <option key={network} value={network} className="bg-green-700 text-green-100">
                {network}
              </option>
            ))}
          </select>
        </div>

        {/* Token Selection */}
        <div>
          <label className="block text-green-300 text-sm font-medium mb-2">Token</label>
          <select 
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            className="w-full bg-green-700 border border-green-600 rounded-lg px-3 py-2 text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {tokens[selectedNetwork as keyof typeof tokens]?.map((token) => (
              <option key={token} value={token} className="bg-green-700 text-green-100">
                {token}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-green-300 text-sm font-medium mb-2">Amount</label>
          <div className="flex items-center gap-2">
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.001"
              min="0"
              className="flex-1 bg-green-700 border border-green-600 rounded-lg px-3 py-2 text-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="0.01"
            />
            <span className="text-green-300 text-sm font-medium">{selectedToken}</span>
          </div>
        </div>

        {/* Send Button */}
        <Button 
          onClick={handleSendTip}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-3 rounded-xl transform hover:scale-105 transition-all duration-300"
        >
          💪 SEND IT
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-green-300 text-xs">
          Support my fitness journey with crypto tips
        </p>
      </div>
    </div>
  );
}
