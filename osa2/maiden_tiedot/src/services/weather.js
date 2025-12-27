import axios from "axios";

const apiKey = import.meta.env.VITE_OPENWEATHER_KEY;

const getByLatLon = async ({ lat, lon }) => {
  if (!apiKey) {
    console.log("weatherService: missing VITE_OPENWEATHER_KEY");
    return null;
  }

  const url =
    "https://api.openweathermap.org/data/2.5/weather" +
    `?lat=${lat}&lon=${lon}` +
    `&appid=${apiKey}` +
    `&units=metric`;

  console.log("weatherService: GET", { lat, lon });

  const res = await axios.get(url);
  return res.data;
};

export default { getByLatLon };
