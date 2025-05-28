import { Container, Typography } from "@mui/material";
import './aboutUs.sass'
import Partners from '../../components/partners/Partners'

const AboutUs = () => {

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        О нас
      </Typography>

      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          О сервисе
        </Typography>
        <Typography variant="body1" paragraph>
          Наш обменник — это надёжная и безопасная платформа для обмена криптовалют и фиатных денег. Мы предлагаем быстрые, выгодные и прозрачные сделки для наших клиентов, обеспечивая максимальный уровень безопасности и конфиденциальности.
        </Typography>
        <Typography variant="body1" paragraph>
          Мы сотрудничаем с проверенными партнёрами, такими как BestChange, и используем современные технологии шифрования и защиты данных, чтобы ваши личные данные и информация о заказах были под надежной защитой.
        </Typography>
        <Typography variant="body1" paragraph>
          Наша команда постоянно работает над улучшением сервиса, чтобы вы могли обменивать валюты с максимальным комфортом и уверенностью.
        </Typography>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Почему выбирают нас
        </Typography>
        <Typography variant="body1" component="ul" sx={{ pl: 3 }}>
          <li>Мгновенное подтверждение обменов и выполнение заказов без задержек.</li>
          <li>Прозрачные комиссии без скрытых платежей.</li>
          <li>Круглосуточная поддержка клиентов, готовая помочь в любое время.</li>
          <li>Гарантии безопасности и надежности всех операций.</li>
          <li>Регулярное обновление курсов с учётом рыночных изменений.</li>
        </Typography>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <Typography variant="h5" gutterBottom>
          Наша миссия
        </Typography>
        <Typography variant="body1" paragraph>
          Сделать обмен криптовалют и фиата максимально удобным и доступным для каждого пользователя. Мы стремимся создавать сервис, который сочетает в себе простоту, безопасность и профессионализм, помогая клиентам уверенно использовать возможности цифровых финансов.
        </Typography>
      </section>

      <Partners />
    </Container>
  )
}

export default AboutUs