import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    _id: "",
    email: "",
    fullname: "",
    role: "",
    positionList: [],
    __v: 0,
  },
  reducers: {
    setUser: (state, action) => {
      console.log('Setting user:', action.payload);
      state._id = action.payload._id;
      state.email = action.payload.email;
      state.fullname = action.payload.fullname;
      state.role = action.payload.role;
      state.positionList = action.payload.positionList;
      state.__v = action.payload.__v;
    },
    // Khi clearUser được gọi, reset state về giá trị ban đầu
    clearUser: (state) => {
      state._id = "";
      state.email = "";
      state.fullname = "";
      state.role = "";
      state.positionList = [];
      state.__v = 0;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
