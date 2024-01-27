import { createSlice, PayloadAction } from "@reduxjs/toolkit";




const initialState : any = {}

export const chat = createSlice({
    name: 'chat',
    initialState,
    reducers:{
        setChatRedux : (state,action : PayloadAction<object>) => {

            
            console.log("setChatRedux payload" , action.payload);
            return action.payload
        },
        addMessageRedux : (state,action : PayloadAction<object>) => {
            console.log(action.payload);
            state.messages.push(action.payload);
        }
    }
     
});


export const {setChatRedux, addMessageRedux} = chat.actions;
export default chat.reducer;