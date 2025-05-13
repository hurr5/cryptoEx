import { Container } from "@mui/material"
import Exchange from "../../components/exchange/Exchange"
import Reviews from "../../components/reviews/Reviews"
import Partners from "../../components/partners/Partners"

export const Home = function () {
  return (
    <Container>
      <Exchange />
      <Reviews />
      <Partners />
    </Container>
  )
}