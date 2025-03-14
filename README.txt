# File Service API

REST API сервис для управления файлами с JWT-авторизацией, написанный на Node.js с использованием Express и MySQL.

## Функциональность

- Регистрация и авторизация пользователей
- JWT-аутентификация с рефреш-токенами
- Загрузка, скачивание, обновление и удаление файлов
- Пагинированный список файлов
- Защищенные API-эндпоинты

## Установка и запуск

### Требования

- Node.js (14+)
- MySQL (5.7+)

### Шаги по установке

1. Клонировать репозиторий:
   ```
   git clone https://github.com/StrongestArtemEver/file-service-api.git
   cd file-service-api
   ```

2. Установить зависимости:
   ```
   npm install
   ```

3. Создать .env файл в корне проекта:
   ```
   NODE_ENV=development
   PORT=3000
   
   # Database
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=file_service_db
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=600 # 10 минут в секундах
   REFRESH_TOKEN_EXPIRES_IN=86400 # 24 часа в секундах
   
   # Upload
   UPLOAD_DIR=./uploads
   ```

4. Запустить сервер:
   ```
   npm start