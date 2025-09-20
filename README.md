# 🌤️ CLI Weather App

A simple **Node.js** weather application that runs directly in your terminal.
It fetches real-time weather data from **[OpenWeather API](https://openweathermap.org/api)**.

---

## 🚀 Features

* Check **current weather** by city name.
* View a **3-day forecast**.
* Colorful CLI output using **chalk**.
* Friendly error handling (invalid API key, city not found, too many requests, etc).

---

## 📦 Installation

1. Clone this repository or download the project:

   ```bash
   git clone https://github.com/username/weather-cli.git
   cd weather-cli
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root folder and add your OpenWeather API key:

   ```
   OPENWEATHER_API_KEY=your_api_key_here
   ```

   👉 You can get a free API key from [OpenWeather](https://home.openweathermap.org/api_keys).

---

## ▶️ Usage

Run the app with:

```bash
node index.js
```

You’ll be prompted to enter a city name:

```
🌤️ Hello! Where do you want to check the weather?

? Enter city name: Tokyo
```

Example output:

```
🌍 Weather in Tokyo, JP

🌡️ Temperature: 28°C
☁️ Condition: scattered clouds
🤔 Feels like: 30°C
💧 Humidity: 65%
💨 Wind: 4.1 m/s

📅 3-Day Forecast:

Today: 29°/22°C - scattered clouds
Tomorrow: 30°/23°C - light rain
Saturday: 27°/21°C - overcast clouds

✨ Thanks for using my weather app!
```

---

## ⚠️ Notes

* If the API key is missing or invalid → you’ll get an error message.
* If the city name is not found → you’ll be asked to check the spelling.
* If too many requests are made → OpenWeather may temporarily block you (status 429).

---

## 🛠️ Tech Stack

* [Node.js](https://nodejs.org/)
* [Axios](https://github.com/axios/axios) → HTTP requests
* [Inquirer](https://github.com/SBoudrias/Inquirer.js/) → CLI prompts
* [Chalk](https://github.com/chalk/chalk) → Terminal colors
* [dotenv](https://github.com/motdotla/dotenv) → Environment variables
