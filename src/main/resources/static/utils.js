export function updateTime() {
  const time = document.querySelector(".time");
  if (!time) {
    console.error("Elementul `.time` nu a fost găsit!");
    return;
  }

  setInterval(() => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    time.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);
}

export function getLocationAndTemperature() {
  const locationInfo = document.getElementById("location-info");
  if (!locationInfo) {
    console.error("Elementul `#location-info` nu a fost găsit!");
    return;
  }

  const locationConsent = localStorage.getItem("locationConsent");

  if (!locationConsent) {
    if (confirm("Permiteți accesul la locația dvs. pentru a afișa temperatura curentă?")) {
      localStorage.setItem("locationConsent", "true");
      fetchLocationAndWeather(locationInfo);
    } else {
      locationInfo.textContent = "Accesul la locație este refuzat.";
    }
  } else {
    fetchLocationAndWeather(locationInfo);
  }
}

function fetchLocationAndWeather(locationInfo) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude, locationInfo);
      },
      (error) => {
        locationInfo.textContent = "Nu s-a putut prelua locația.";
        console.error("Eroare la preluarea locației:", error);
      }
    );
  } else {
    locationInfo.textContent = "Geolocalizarea nu este suportată de acest browser.";
  }
}

function fetchWeather(lat, lon, locationInfo) {
  const apiKey = "55bf58bc8c98f06d26dc17fdc713c464";
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=ro&appid=${apiKey}`;

  fetch(weatherUrl)
    .then((response) => response.json())
    .then((data) => {
      const temperature = data.main.temp.toFixed(1);
      const city = data.name;
      locationInfo.textContent = `${city} ${temperature}°C`;
    })
    .catch((error) => {
      locationInfo.textContent = "Nu s-a putut prelua temperatura.";
      console.error("Eroare la API-ul meteo:", error);
    });
}
