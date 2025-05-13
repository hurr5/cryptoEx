import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstComponentType: null,
  secondComponentType: null,
  firstAmount: 0,
  secondAmount: 0,
  firstCurrency: null,
  secondCurrency: null,
  selectedFiatCurrency: 'USD',
};

const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    setFirstComponentType: (state, action) => {
      state.firstComponentType = action.payload;
      state.secondComponentType = action.payload === 'fiat' ? 'crypto' : 'fiat';
    },
    setSecondComponentType: (state, action) => {
      state.secondComponentType = action.payload;
      state.firstComponentType = action.payload === 'fiat' ? 'crypto' : 'fiat';
    },
    setFirstAmount: (state, action) => {
      state.firstAmount = action.payload;
    },
    setSecondAmount: (state, action) => {
      state.secondAmount = action.payload;
    },
    setFirstCurrency: (state, action) => {
      state.firstCurrency = action.payload;
    },
    setSecondCurrency: (state, action) => {
      state.secondCurrency = action.payload;
    },
    setSelectedFiatCurrency: (state, action) => {
      state.selectedFiatCurrency = action.payload;
    },
  },
});

export const {
  setFirstComponentType,
  setSecondComponentType,
  setFirstAmount,
  setSecondAmount,
  setFirstCurrency,
  setSecondCurrency,
  setSelectedFiatCurrency,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;