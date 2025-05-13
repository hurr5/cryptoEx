import { configureStore } from "@reduxjs/toolkit"
import exchangeReducer from './slices/exchangeSlice'

const store = configureStore({
  reducer: {
    exchange: exchangeReducer
  },
  devTools: process.env.NODE_ENV !== 'production',
})

export default store