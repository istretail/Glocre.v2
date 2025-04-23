import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {
        getCategoryRequest: (state) => {
            state.loading = true;
        },
        getCategorySuccess: (state, action) => {
            return {
                loading: false,
                isAuthenticated: true,              
                categories: action.payload.data,
                
            };
        },
        getCategoryFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

    },
});
const { actions, reducer } = categorySlice;
export const {
    getCategoryRequest,
    getCategorySuccess,
    getCategoryFail
} = actions;

export default reducer;
