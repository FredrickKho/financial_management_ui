import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentUser : null,
    expired : null,
    isLoading: true,
}
const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        login:(state,action) => {
            // console.log("Payload in login reducer:", action.payload); // Log to verify
            state.currentUser = action.payload // Store the logged-in user
            state.isLoading = false
        },
        logout:(state) => {
            state.currentUser = null // Remove user data on logout
            state.expired = null
        },
        setExpired:(state,action) => {
            state.expired = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload; // Optionally set loading state from outside
        },
    }
})

export const { login, logout,setExpired, setLoading } = authSlice.actions;
export default authSlice.reducer;