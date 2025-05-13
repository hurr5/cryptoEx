import pyautogui
import keyboard
import time

running = False

def toggle_clicker():
    global running
    running = not running
    if running:
        print("Автокликер включён!")
    else:
        print("Автокликер выключён!")

keyboard.add_hotkey('h', toggle_clicker)

print("h для включения/выключения. Для выхода Ctrl+C")

try:
    while True:
        if running:
            pyautogui.click()
            time.sleep(0.01)
except KeyboardInterrupt:
    print("\nПрограмма завершена.")
