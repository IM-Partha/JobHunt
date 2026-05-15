import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null
    },
     reducers:{
        setLoading:(state, action)=>{
            state.loading = action.payload
        },
        setAuthUser:(state,action)=>{
            state.user = action.payload
        },
        updateUserSavedJobs:(state,action)=>{
            if(state.user && state.user.profile) {
                state.user.profile.savedJobs = action.payload;
            }
        }
     }
})


export const {setLoading, setAuthUser, updateUserSavedJobs} = authSlice.actions
export default authSlice.reducer