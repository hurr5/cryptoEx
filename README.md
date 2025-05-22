> [!CAUTION]  
> Проект использует PostgreSQL в качестве СУБД. Убедитесь, что PostgreSQL установлен и база данных настроена перед запуском backend'а. Telegram-бот в экспериментальной стадии.

---

## 📦 Установка и запуск

### 🔁 Backend (Django)

> [!TIP]  
> Перед началом убедитесь, что у вас установлен Python 3.10+ и PostgreSQL.

1. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```

2. Установите и запустите **PostgreSQL**.
   Создайте базу данных с названием:

   ```
   CryptoEx
   ```

3. Перейдите в папку `crypto_backend`:

   ```
   cd crypto_backend
   ```

4. Выполните миграции:

   ```
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Запустите сервер:

   ```
   python manage.py runserver
   ```

> 💡 При следующих запусках достаточно перейти в `crypto_backend` и запустить `runserver`.

---

### 🌐 Frontend (Vite + Vue)

> \[!TIP]
> Используется [pnpm](https://pnpm.io/) как менеджер пакетов.

1. Перейдите в папку `cryptoEx`:

   ```
   cd cryptoEx
   ```

2. Запустите локальный dev-сервер:

   ```
   pnpm install
   pnpm run dev
   ```

---

### 🤖 Telegram-бот

> \[!WARNING]
> Бот работает нестабильно и пока не интегрирован полноценно. Его запуск возможен только вручную.

1. Перейдите в папку `CryptoEx_bot`:

   ```bash
   cd CryptoEx_bot
   ```

2. Запустите файл `main.py`:

   ```bash
   python main.py
   ```

> 📎 Ссылка на Telegram-бота: [@CryptoExchat\_bot](https://t.me/CryptoExchat_bot)

---

## 📁 Структура проекта

* `crypto_backend/` — Django-приложение (серверная логика, API).
* `cryptoEx/` — клиентская часть (frontend).
* `CryptoEx_bot/` — Telegram-бот.
* `requirements.txt` — зависимости для backend.
