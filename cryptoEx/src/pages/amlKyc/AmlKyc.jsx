import { Container, Typography, Box } from "@mui/material";
import "./amlKyc.sass";

const AmlKyc = () => {
  return (
    <Container>
      <Box className="aml-kyc">
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Политика AML/KYC
        </Typography>

        <Typography variant="h5" component="h2" gutterBottom>
          AML/CTF и KYC Политика
        </Typography>

        <Typography variant="subtitle1" color="textSecondary">
          Дата вступления в силу: 01.11.2021 года. Обновлено 27.05.2022 года.
        </Typography>

        <Typography paragraph>
          Настоящая Политика AML (далее — Политика) регламентирует деятельность sber exchange в отношении борьбы с отмыванием денег и её вовлеченность в борьбе с отмыванием денег и финансированием террористической деятельности.
        </Typography>

        <Box mt={4}>
          <Typography variant="h5" component="h3" gutterBottom>
            Термины и определения
          </Typography>
          <Typography paragraph>
            <b>sber exchange</b> – это торговая марка системы, предоставляющей Пользователям возможность обмена цифровой и электронной валюты.
          </Typography>
          <Typography paragraph>
            <b>Сервис</b> – система предоставления интернет-услуг по обмену, продаже и покупке цифровых и/или электронных валют.
          </Typography>
          {/* Другие определения можно оформить аналогично */}
        </Box>

        <Box mt={4}>
          <Typography variant="h5" component="h3" gutterBottom>
            Мероприятия, предпринятые в рамках соблюдения Политики AML
          </Typography>
          <Typography paragraph>
            Администрация сервиса sber exchange, понимая общественную опасность преступлений, связанных с отмыванием денежных средств и финансированием террористической деятельности, разработала комплекс организационно-правовых мер...
          </Typography>
          <Typography paragraph>
            Европейское регулирование AML основывается на ряде законодательных директив...
          </Typography>
          {/* Список директив можно оформить с помощью Typography в `body1` или `body2` */}
        </Box>

        <Box mt={4}>
          <Typography variant="h5" component="h3" gutterBottom>
            Политика KYT (Know Your Transaction)
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Дата вступления в силу: 01.11.2021 года. Обновлено 23.08.2022 года.
          </Typography>
          <Typography paragraph>
            Политика KYT направлена на идентификацию клиента сделки в случае прецедента, когда у Сервиса есть подозрения в том, что Клиент использует sber exchange не по назначению.
          </Typography>
          {/* Продолжите секцию аналогично */}
        </Box>
      </Box>
    </Container>
  );
};

export default AmlKyc;