import './partners.sass'
import bestchange from '../../assets/bestchange.svg'
import exnode from '../../assets/exnode.svg'

const Partners = () => {
  return (
    <div className="partners">
      <h2 className="partners__title">Our partners:</h2>
      <div className="partners__icons">
        <a href="https://www.bestchange.com/" target='_blank'>
          <img src={bestchange} className="partners__icon" style={{ 'width': '250px', }} alt="Best Change" />
        </a>
        <a href="https://exnode.ru/" target='_blank'>
          <img src={exnode} className="partners__icon" style={{ 'width': '250px', }} alt="Exnode" />
        </a>
      </div>
    </div >
  )
}

export default Partners;