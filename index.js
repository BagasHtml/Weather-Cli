const axios = require("axios");
const inquirer = require("inquirer");
const chalk = require("chalk");
require('dotenv').config();

const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
    console.error(chalk.red("❌ Woi! API key belum diset nih!"));
    console.log(chalk.yellow("Bikin file .env terus tulis: OPENWEATHER_API_KEY=api_key_kamu"));
    process.exit(1);
}

async function cariKota(namaKota) {
    try {
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(namaKota)}&limit=1&appid=${API_KEY}`;
        
        const response = await axios.get(url);
        const data = response.data;
        
        if (!data || data.length === 0) {
            throw new Error(`Kota "${namaKota}" gak ketemu bro. Coba cek lagi ejaannya`);
        }
        
        return {
            lat: data[0].lat,
            lon: data[0].lon,
            nama: data[0].name,
            negara: data[0].country
        };
    } catch (error) {
        if (error.response?.status === 401) {
            throw new Error("API key salah nih! Cek lagi di .env file");
        }
        throw error;
    }
}

async function ambilCuaca(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(chalk.red("Gagal ambil data cuaca:", error.message));
        throw error;
    }
}

async function ambilPerkiraan(lat, lon) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
        
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(chalk.red("Gagal ambil perkiraan cuaca:", error.message));
        throw error;
    }
}

function tampilkanCuaca(cuaca, lokasi) {
    console.log(chalk.cyan(`\n🌍 Cuaca di ${lokasi.nama}, ${lokasi.negara}\n`));
    console.log(`${chalk.yellow("🌡️")} Suhu: ${Math.round(cuaca.main.temp)}°C`);
    console.log(`${chalk.yellow("☁️")} Kondisi: ${cuaca.weather[0].description}`);
    console.log(`${chalk.yellow("🤔")} Terasa: ${Math.round(cuaca.main.feels_like)}°C`);
    console.log(`${chalk.yellow("💧")} Kelembaban: ${cuaca.main.humidity}%`);
    console.log(`${chalk.yellow("💨")} Angin: ${cuaca.wind.speed} m/s`);
}

function tampilkanPerkiraan(perkiraan) {
    console.log(chalk.cyan("\n📅 Perkiraan 3 hari kedepan:\n"));
    
    const hariIni = new Date().getDate();
    const dataPerHari = {};
    
    perkiraan.list.slice(0, 24).forEach(item => {
        const tanggal = new Date(item.dt * 1000);
        const hari = tanggal.getDate();
        
        if (!dataPerHari[hari]) {
            dataPerHari[hari] = {
                tanggal: tanggal,
                suhuList: [],
                cuacaList: []
            };
        }
        
        dataPerHari[hari].suhuList.push(item.main.temp);
        dataPerHari[hari].cuacaList.push(item.weather[0].description);
    });
    
    Object.values(dataPerHari).slice(0, 3).forEach((hari, index) => {
        const suhuMax = Math.round(Math.max(...hari.suhuList));
        const suhuMin = Math.round(Math.min(...hari.suhuList));
        const cuacaUtama = hari.cuacaList[0]; // Ambil cuaca pertama aja
        
        let labelHari;
        if (index === 0) {
            labelHari = "Hari ini";
        } else if (index === 1) {
            labelHari = "Besok";
        } else {
            labelHari = hari.tanggal.toLocaleDateString('id-ID', { weekday: 'long' });
        }
        
        console.log(`${chalk.green(labelHari)}: ${suhuMax}°/${suhuMin}°C - ${cuacaUtama}`);
    });
}

async function main() {
    try {
        console.log(chalk.blue("🌤️ Halo! Mau cek cuaca dimana nih?\n"));
        
        const { kota } = await inquirer.prompt([
            {
                type: "input",
                name: "kota",
                message: "Ketik nama kota:",
                validate: input => input.trim().length > 0 || "Jangan kosong dong!"
            }
        ]);
        
        console.log(chalk.gray("🔍 Lagi nyari datanya..."));
        
        const lokasi = await cariKota(kota.trim());
        
        const [cuacaSekarang, perkiraanCuaca] = await Promise.all([
            ambilCuaca(lokasi.lat, lokasi.lon),
            ambilPerkiraan(lokasi.lat, lokasi.lon)
        ]);
        
        tampilkanCuaca(cuacaSekarang, lokasi);
        tampilkanPerkiraan(perkiraanCuaca);
        
        console.log(chalk.gray("\n✨ Makasih udah pake aplikasi gue!"));
        
    } catch (error) {
        console.error(chalk.red(`\n💥 Waduh error nih: ${error.message}`));
        
        if (error.response?.status === 429) {
            console.log(chalk.yellow("🚫 Kebanyakan request nih, tunggu sebentar ya"));
        }
    }
}

main();