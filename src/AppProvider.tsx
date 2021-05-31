import React, { createContext, useState } from "react";
import { LooseObject } from './config/index.type'


export const AppContext = createContext<any | null>(null);

export default function AppProvider(props: LooseObject) {
  const [lastUpdate, set_lastUpdate] = useState(new Date().toLocaleTimeString());

  function refresh(){
    set_lastUpdate(new Date().toLocaleTimeString())
  }

  return (
    <AppContext.Provider value={{"lastUpdate": lastUpdate, 'refresh': refresh}}>
      {props.children}
    </AppContext.Provider>
  )
}
