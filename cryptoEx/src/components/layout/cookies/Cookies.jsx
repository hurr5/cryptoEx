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
        <h2 className="cookies__title">Политика Cookies</h2>
        <p className="cookies__text">
          Наш сайт использует файлы cookie для обеспечения наилучшего взаимодействия с пользователем. Используя наш сайт, вы соглашаетесь с использованием файлов cookie.
        </p>
        <button className="cookies__button" onClick={onCookiesSubmit}>Принять</button>
        <button className="cookies__button cookies__button--decline" onClick={onCookiesDecline}>Отклонить</button>
      </div>
    </div>
  )
}

export default Cookies;