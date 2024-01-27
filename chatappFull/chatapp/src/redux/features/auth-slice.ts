import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState{
    isAuth : boolean;
    user : null|any;
}


const initialState : AuthState = {
    isAuth : false,
    user : null
}

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers:{
        logIn : (state,action : PayloadAction<object>) => {
            console.log(action.payload);
            state.isAuth = true;
            state.user =  action.payload;
        },
        logOut : (state) => {
            console.log("logout");
            state.isAuth = false;
            state.user = null;
        }
    }
     
});

export const {logIn, logOut} = auth.actions;
export default auth.reducer;