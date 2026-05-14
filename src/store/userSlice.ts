import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    isAuthenticated: boolean;
    user: any | null;
    token: string | null;
}

const initialState: UserState = {
    isAuthenticated: false,
    user: null,
    token: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: any) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
