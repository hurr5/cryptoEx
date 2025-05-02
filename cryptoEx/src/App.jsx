import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'
import store from './store'
import ScrollToTop from './components/common/ScrollToTop'
import { Home } from './pages/home/Home'
import Header from "./components/layout/header/Header"
import Footer from "./components/layout/footer/Footer"
import Order from './components/order/Order'
import Reviews from './components/reviews/Reviews'
import NoMatch from './pages/noMatch/NoMatch'
import AmlKyc from './pages/amlKyc/AmlKyc'
import Privacy from './pages/privacy/Privacy'
import AboutUs from './pages/aboutUs/AboutUs'
import Cookies from './components/layout/cookies/Cookies'
import OrderConfirmed from './components/order-confirmed/OrderConfirmed';

function App() {

  const theme = createTheme({
    typography: {
      fontFamily:
        'Nunito, Arial, sans-serif'
    }
  })

  return (
    <Provider store={store}>
      <Router
        v7_startTransition={true}
        v7_relativeSplatPath={true}
      >
        <ScrollToTop />
        <ThemeProvider theme={theme}>
          <div className="app">
            <Header />
            <Cookies />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/order/:orderId" element={<Order />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/aml-kyc" element={<AmlKyc />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/aboutUs" element={<AboutUs />} />
                <Route path="*" element={<NoMatch />} />
                <Route path="/order-confirmed/:orderId" element={<OrderConfirmed />} />
              </Routes>
              <Footer />
            </main>
          </div>
        </ThemeProvider>
      </Router>
    </Provider>
  )
}

export default App
