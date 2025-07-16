import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name:'chats',
    initialState:{
        loggedInUsers:[],
        messages:[],
        isSendingMessage:false,
    },
    reducers:{
        setLoggedInUsers:(state,action) => {
            state.loggedInUsers = action.payload;
        },
        setMessages:(state,action) => {
            state.messages = action.payload;
        },
        setIsSendingMessage:(state,action) => {
            state.isSendingMessage = action.payload;
        },
        addNewMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    }
});

export const {
    setLoggedInUsers ,
    setMessages ,
    setIsSendingMessage ,
    addNewMessage
} = chatSlice.actions;

export default chatSlice.reducer;