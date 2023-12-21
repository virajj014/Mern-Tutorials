import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User{
    name : string;
    email : string;
    age : number;

}
interface AuthState{
    isAuth : boolean;
    user : null|User;
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
            state.isAuth = true;
            state.user =  action.payload as User;
        },
        logOut : (state) => {
            state.isAuth = false;
            state.user = null;
        }
    }
     
});

export const {logIn, logOut} = auth.actions;
export default auth.reducer;