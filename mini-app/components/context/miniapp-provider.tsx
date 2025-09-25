"use client";

import { createContext, useContext, useEffect, useState } from "react";
import sdk from "@farcaster/miniapp-sdk";
import { MiniAppSDK } from "@farcaster/miniapp-sdk/dist/types";

export interface MiniAppContext {
  sdk: MiniAppSDK;
}
const defaultSettings: MiniAppContext = {
  sdk,
};
const MiniAppContext = createContext<MiniAppContext>(defaultSettings);

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<MiniAppContext>(defaultSettings);

  useEffect(() => {
    context.sdk.actions.ready();
  }, []);

  return (
    <MiniAppContext.Provider value={context}>
      {children}
    </MiniAppContext.Provider>
  );
}

export function useMiniAppContext() {
  return useContext(MiniAppContext);
}
