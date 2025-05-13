import { Container, Typography } from "@mui/material";
import './aboutUs.sass'
import Partners from '../../components/partners/Partners'

const AboutUs = () => {

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        About us
      </Typography>

      <div style={{ marginBottom: '2rem' }}>
        <div>
          <Typography variant="h5" gutterBottom>
            О сервисе
          </Typography>
          <Typography variant="body1">
            Our exchanger - is a safety platform for exchange cryptocurrency and fiat currencies. We offer fast, safe and profitable deals for our clients.
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            We work with popular partners like BestChange and use best technologies to keep your personal information and order in safe.
          </Typography>
        </div>
      </div>
      <Partners />
    </Container>

  )
}

export default AboutUs