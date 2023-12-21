import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { stat } from "fs";


interface User {
    name: string;
    email: string;
    age: number;
}

interface AuthState {
    isAuth: boolean;
    user: User | null;
}

const initialState: AuthState = {
    isAuth: false,
    user: null
}


export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logIn: (state, action: PayloadAction<object>) => {
            console.log(action.payload);
            state.isAuth = true;
            state.user = action.payload as User;
        },
        logOut: (state) => {
            state.isAuth = false;
            state.user = null;
        }
    }
})

export const { logIn, logOut } = auth.actions;
export default auth.reducer;