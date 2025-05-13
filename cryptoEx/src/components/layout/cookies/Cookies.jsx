import { useEffect } from 'react';
import { useState } from 'react';

import './cookies.sass'

const Cookies = () => {

  const [showCookies, setShowCookies] = useState(false);

  const onCookiesSubmit = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowCookies(false);
  }

  const onCookiesDecline = () => {
    localStorage.setItem('cookiesAccepted', 'false');
    setShowCookies(false);
  }

  useEffect(() => {
    localStorage.getItem('cookiesAccepted') === 'true' ? setShowCookies(false) : setShowCookies(true);
  }, [])

  return (
    <div className={`cookies ${showCookies ? 'cookies__active' : ''}`}>
      <div className="cookies__content">
        <h2 className="cookies__title">Cookies Policy</h2>
        <p className="cookies__text">
          This website uses cookies to ensure you get the best experience on our website. By using our website, you agree to our use of cookies.
        </p>
        <button className="cookies__button" onClick={onCookiesSubmit}>Accept</button>
        <button className="cookies__button cookies__button--decline" onClick={onCookiesDecline}>Decline</button>
      </div>
    </div>
  )
}

export default Cookies;