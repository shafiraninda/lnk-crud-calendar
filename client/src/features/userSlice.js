import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: "user",
    initialState: {
        user_id: '',
        token: '',
        username: '',
        loginTime_id: '',
        loginTime: ''
    },
    reducers: {
        update: (state, action) => {
            // eslint-disable-next-line no-unused-expressions
            state.user_id = action.payload.user_id;
            state.token = action.payload.token;
            state.username = action.payload.username;
            state.loginTime_id = action.payload.loginTime_id;
            state.loginTime = action.payload.loginTime;
        }
    }
})

export const {update} = userSlice.actions;
export default userSlice.reducer;