import React, { createContext, useState } from "react";
import { LooseObject } from './config/index.type';
import { statusBarConfig } from './store/store'


export const AppContext = createContext<any | null>(null);

export default function AppProvider(props: LooseObject) {
  const [cardStatusLoading, set_cardStatusLoading] = useState(true);

  const [cardStatus, set_cardStatus] = useState([{
    status: '', uptime: '', cpu: '',
    ram_total: '',
    ram_available: '',
    ram_used: '',
    ram_free: '',
    ram_lootnika: '',
  }]);
  
  return (
    <AppContext.Provider value={{
      'set_cardStatusLoading': set_cardStatusLoading,
      'cardStatusLoading': cardStatusLoading,
      'set_cardStatus': set_cardStatus,
      'cardStatus': cardStatus,
      'statusBarConfig': statusBarConfig,
    }}>
      {props.children}
    </AppContext.Provider>
  )
}
