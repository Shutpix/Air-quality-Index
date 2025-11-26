# AQI MERN Project Documentation

## 1. Project Structure Overview

```
backend/
│
├── controllers/
│   └── aqiController.js
│
├── routes/
│   └── aqi.js
│
├── services/
│   └── waqiService.js
│
├── utils/
│   └── cache.js  (if present)
│
├── .env
├── config.js
├── server.js
├── package.json
└── package-lock.json


frontend/aqi-app/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── AqiHeader.jsx
│   │   ├── AqiSearch.jsx
│   │   └── CachedCityList.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── vite.config.js
│
├── package.json
└── package-lock.json
```

---

## 2. Backend Description

### 2.1 `server.js`
- Initializes Express server  
- Applies middleware (helmet, morgan, CORS)  
- Mounts `/api/aqi` route  
- Runs backend on configured PORT  

### 2.2 `aqiController.js`
- Handles `GET /api/aqi?city={name}`  
- Fetches AQI data using waqiService  
- Stores recent search queries  
- Generates health category summary  
- Returns paginated recent search history  
- Returns paginated cached city list  

### 2.3 `waqiService.js`
- Fetches data from WAQI API using axios  
- Normalizes city names  
- Implements caching (QuickLRU or similar)  
- Returns structured response  

---

## 3. Frontend Description

### 3.1 `AqiHeader.jsx`
- Displays the top header  
- Includes AQI logo + title  
- Styled with gradient background  

### 3.2 `AqiSearch.jsx`
- Search bar for user input  
- Calls backend `/api/aqi`  
- Displays detailed AQI UI card  
- Shows PM10, PM2.5, AQI scale, category  
- Handles errors with fade-out animation  

### 3.3 `CachedCityList.jsx`
- Calls `/api/aqi/list`  
- Shows cached city list with pagination  
- Independent reusable component  

---

## 4. API Endpoints

### `GET /api/aqi?city={name}`
Fetch AQI data for specified city.

### `GET /api/aqi/list?page=1&limit=10`
Get paginated cached cities list.

### `GET /api/aqi/recent?page=1&limit=10`
Get paginated recent search history.

---

## 5. Technologies Used

### Backend
- Node.js  
- Express.js  
- Axios  
- QuickLRU (cache)

### Frontend
- React + Vite  
- TailwindCSS  

### External API
- WAQI (World Air Quality Index API)

---

## 6. Summary

This MERN stack application retrieves global AQI levels, caches results, and displays them through a modern UI.  
It includes neat components, clean API structure, and visually appealing AQI cards.
Note:- The web app only displays the aqi of the cities that are available in the WAQI otger wise it shows a error message saying we are working on it.
