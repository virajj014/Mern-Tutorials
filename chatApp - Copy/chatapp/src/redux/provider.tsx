"use client";

import { store } from "./store"
import { Provider } from "react-redux"


export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    console.log("ReduxProvider refresh")

   
    return <Provider store={store}>

        {children}

    </Provider>
}