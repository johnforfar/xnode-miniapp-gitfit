"use client";

import { createContext, useContext, useEffect, useState } from "react";
import sdk, { Context } from "@farcaster/miniapp-sdk";

export interface MiniAppContext {
  context: Context.MiniAppContext | undefined;
}
const defaultSettings: MiniAppContext = {
  context: undefined,
};
const MiniAppContext = createContext<MiniAppContext>(defaultSettings);

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<MiniAppContext>(defaultSettings);

  useEffect(() => {
    const ready = async () => {
      await Promise.all([
        sdk.back.enableWebNavigation().catch(console.error),
        sdk.context
          .then((context) =>
            setContext((oldContext) => {
              return { ...oldContext, context };
            })
          )
          .catch(console.error),
      ]);

      await sdk.actions.ready().catch(console.error);
    };

    ready();
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
