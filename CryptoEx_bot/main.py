import telebot
from telebot import types
import psycopg2
import uuid
from decimal import Decimal, ROUND_DOWN
from django.conf import settings

bot = telebot.TeleBot(settings.TELEGRAM_BOT_TOKEN)

DB_HOST = 'localhost'
DB_PORT = '5432'
DB_NAME = 'CryptoEx'
DB_USER = 'postgres'
DB_PASS = 'hujiyg67859D'

TABLE_NAME = 'main_order'

def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASS
    )

def round_to_tenthousandths(value):
    return Decimal(value).quantize(Decimal('0.0001'), rounding=ROUND_DOWN)

def notify_website(order_id, status):
    print(f"[API STUB] Заказ {order_id} обновлён до статуса {status}")

@bot.message_handler(commands=['start'])
def start_handler(message):
    bot.send_message(message.chat.id, "Добро пожаловать! Введите /order <id> или /order list.")

@bot.message_handler(commands=['order'])
def order_handler(message):
    parts = message.text.split()

    if len(parts) < 2:
        bot.send_message(message.chat.id, "Используйте: /order <id> или /order list")
        return

    arg = parts[1]

    if arg == 'list':
        send_pending_orders(message.chat.id)
    elif arg.isdigit():
        send_order_details(message.chat.id, arg)
    else:
        bot.send_message(message.chat.id, "Неверная команда. Используйте: /order <id> или /order list")

def send_order_details(chat_id, order_id):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            f"""
            SELECT o.id, o.from_currency, o.to_currency, o.amount, o.rate, o.total,
                o.email, p.address, o.status, o.created_at
            FROM {TABLE_NAME} o
            LEFT JOIN main_paymentdetails p ON o.payment_details_id = p.id
            WHERE o.id = %s
            """,
            (order_id,)
        )
        order = cur.fetchone()
        if not order:
            bot.send_message(chat_id, "Заказ не найден.")
            return

        total = round_to_tenthousandths(order[5])
        order_details = (
            f"Заказ #{order[0]}\n"
            f"Отдаёте: {order[1]}\n"
            f"Получаете: {order[2]}\n"
            f"Сумма: {order[3]}\n"
            f"Курс: {order[4]}\n"
            f"Итого: {total}\n"
            f"Email: {order[6]}\n"
            f"Платёжные данные: {order[7]}\n"
            f"Статус: {order[8]}\n"
            f"Создан: {order[9].strftime('%d-%m-%Y %H:%M:%S')}\n"
        )

        markup = types.InlineKeyboardMarkup()
        markup.add(types.InlineKeyboardButton("Подтвердить оплату", callback_data=f"confirm_{order_id}"))
        markup.add(types.InlineKeyboardButton("Отклонить оплату", callback_data=f"cancel_{order_id}"))

        bot.send_message(chat_id, order_details, reply_markup=markup)
        cur.close()
    except Exception as e:
        bot.send_message(chat_id, f"Ошибка при получении заказа: {e}")
    finally:
        if conn:
            conn.close()

def send_pending_orders(chat_id):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            f"SELECT id, from_currency, to_currency, amount, total, email, status "
            f"FROM {TABLE_NAME} WHERE status = 'pending'"
        )
        rows = cur.fetchall()
        if not rows:
            bot.send_message(chat_id, "Нет заказов со статусом 'pending'.")
            return

        msg = "Список заказов со статусом 'pending':\n\n"
        for row in rows:
            msg += (
                f"Заказ #{row[0]} | {row[1]} → {row[2]}\n"
                f"Сумма: {row[3]} | Итого: {round_to_tenthousandths(row[4])}\n"
                f"Email: {row[5]}\n"
                f"Статус: {row[6]}\n\n"
            )
        bot.send_message(chat_id, msg)
        cur.close()
    except Exception as e:
        bot.send_message(chat_id, f"Ошибка при получении заказов: {e}")
    finally:
        if conn:
            conn.close()

@bot.callback_query_handler(func=lambda call: True)
def callback_handler(call):
    data = call.data
    if data.startswith("confirm_"):
        order_id = data.split("_")[1]
        update_order_status(order_id, "fulfilled")
        notify_website(order_id, "fulfilled")
        bot.edit_message_reply_markup(chat_id=call.message.chat.id, message_id=call.message.message_id, reply_markup=None)
        bot.edit_message_text(chat_id=call.message.chat.id, message_id=call.message.message_id,
                              text=f"Заказ {order_id} подтверждён. Оплата принята.")
        bot.answer_callback_query(call.id, "Оплата подтверждена!")
    elif data.startswith("cancel_"):
        order_id = data.split("_")[1]
        update_order_status(order_id, "canceled")
        notify_website(order_id, "canceled")
        bot.edit_message_reply_markup(chat_id=call.message.chat.id, message_id=call.message.message_id, reply_markup=None)
        bot.edit_message_text(chat_id=call.message.chat.id, message_id=call.message.message_id,
                              text=f"Заказ {order_id} отклонён. Оплата не принята.")
        bot.answer_callback_query(call.id, "Оплата отклонена!")

def update_order_status(order_id, new_status):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(f"UPDATE {TABLE_NAME} SET status = %s WHERE id = %s", (new_status, order_id))
        conn.commit()
        cur.close()
    except Exception as e:
        print(f"Ошибка обновления заказа: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    print("Бот запущен")
    bot.polling(none_stop=True)
