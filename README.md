<h1 align="center">Бот нагадувач 🔔</h1>

## Як налаштувати бота?
У корені є файл [.env.example](https://github.com/DemonWayne/UA-Bump-Reminder/blob/main/.env.example) дублюєте його та прибираєте .example

# TOKEN
Створити бота та отримати токен можна [тут](https://discord.com/developers/applications)
У полі DISCORD_TOKEN після знаку дорівнює вставляєте токен свого бота

# DATABASE
Спочатку треба створити базу та скопіювати посилання на базу даних, зробити це можна на цьому сайті - [MongoDB](https://cloud.mongodb.com)
У поле DATABASE_URL вставляємо посилання

# DEVS та ICON_URL
Це не обов'язкові змінні, у DEVS Ви пишите ID розробників (через кому).
У ICON_URL посилання на іконку яку Ви хочете.

## Як увімкнути бота?
1. Відкриваємо термінал (консоль)
2. Пишемо **npm i** щоб встановити необхідні модулі. [Встановити node та npm](https://nodejs.org/)
3. Коли модулі встановляться пишемо: `npm run build`
4. Тепер щоб увімкнути бота пишемо: `npm run start`

## Режим розробника
Щоб запустити бота у режимі розробника пишемо: `npm run watch:start`

## Я хочу допомогти у розробці
Щоб допомогти Ви можете:
1. Створити [запит](https://github.com/DemonWayne/UA-Bump-Reminder/issues)
2. Зробити Fork репозіторію та після того як зробите покращення створити [запит на витяг](https://github.com/DemonWayne/UA-Bump-Reminder/pulls)<br>
2.1. **Увага! Всі запити на витяг робити на активну гілку! Якщо такої немає, то в гілку dev** 

## Ліцензія

Apache-2.0 © [DemonWayne](https://github.com/DemonWayne), [Єдине Україномовне Ком'юніті](https://discord.gg/uuc)
