# Мой участок

Веб-приложение для загрузки PDF СРЗУ, распознавания координат, пересчета в WGS84, проверки топокорректности и отображения объекта на карте. Подробную инструкцию по развертыванию веб-приложения можно найти внутри репозитория MyParcel

## Стек
- Frontend: React + Vite + TypeScript
- Backend: FastAPI
- PDF parsing: pdfplumber
- Geometry: shapely
- Projection: pyproj
- Excel: openpyxl
- Map: Leaflet

## Структура
- backend/
- frontend/

## Запуск backend

### 1. Перейти в папку backend
```bash
cd backend
```

### 2. Создать виртуальное окружение
```bash
python -m venv .venv
```

### 3. Активировать окружение

#### Windows PowerShell
```bash
.\.venv\Scripts\Activate.ps1
```

#### Windows CMD
```bash
.\.venv\Scripts\activate.bat
```

#### Linux / macOS / Git Bash
```bash
source .venv/bin/activate
```

### 4. Установить зависимости
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 5. Запустить backend
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend будет доступен на:
- http://localhost:8000
- http://localhost:8000/docs

---

## Запуск frontend

### 1. Открыть новый терминал и перейти в frontend
```bash
cd frontend
```

### 2. Установить зависимости
```bash
npm install
```

### 3. Запустить frontend
```bash
npm run dev
```

Frontend будет доступен на:
- http://localhost:5173

---

## Порядок работы
1. Выберите систему координат.
2. Нажмите загрузку PDF.
3. Дождитесь распознавания координат.
4. При необходимости отредактируйте координаты в модальном окне.
5. Подтвердите.
6. После сохранения геометрии откройте объект в списке "Земельной участок" на карте.

---

## Замечания
- Разрешены только PDF-файлы.
- Если в PDF не найдена таблица координат, выводится сообщение об ошибке.
- Результаты геометрии сохраняются в `backend/geometry.xlsx`.
- Логи записываются в `backend/logs/app.log`.
