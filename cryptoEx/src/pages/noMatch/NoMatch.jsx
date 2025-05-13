import { Button, Grid2 as Grid } from "@mui/material"
import notFound from "../../assets/notFound.svg"
import { Link } from "react-router-dom"
import './noMatch.sass'

const NoMatch = () => {
  return (
    <Grid container>
      <Grid size={6} className="error">
        <img src={notFound} style={{ width: '300px' }} />
        <h2>Page not found</h2>
        <div style={{ marginTop: '20px' }}>Sorry, we couldn&apos;t find the page you&apos;re looking for.<br /> Perhaps you&apos;ve mistyped the URL? Be sure to check <br />your spelling.</div>
        <Link to='/'>
          <Button sx={{ marginTop: '30px' }}>Go to homepage</Button>
        </Link>
      </Grid>
    </Grid>
  )
}

export default NoMatch