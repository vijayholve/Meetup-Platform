function safeJSONParse(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.error(`Error parsing localStorage "${key}"`, e);
    return null;
  }
}

const initialState = {
  user: safeJSONParse("user"),
  tokens: safeJSONParse("tokens"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload.user;
      state.tokens = action.payload.tokens;
    },
    logout(state) {
      state.user = null;
      state.tokens = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
