import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    date : null,
    time: null,
}
const uiSlice = createSlice({
    name:'ui',
    initialState,
    reducers:{
        setDate:(state,action) => {
            // console.log("Payload in login reducer:", action.payload); // Log to verify
            state.date = action.payload // Store the logged-in user
        },
        setTime:(state,action) => {
            // console.log("Payload in login reducer:", action.payload); // Log to verify
            state.time = action.payload // Store the logged-in user
        },
        clear:(state) => {
            state.date = null
            state.time = null
        }
    }
})

export const { setDate,setTime, clear } = uiSlice.actions;
export default uiSlice.reducer;