import { useEffect, useMemo, useState } from "react";
import countriesService from "./services/countries";
import weatherService from "./services/weather";

console.log("ENV KEY:", import.meta.env.VITE_OPENWEATHER_KEY);

const Filter = ({ value, onChange }) => (
  <div>
    find countries <input value={value} onChange={onChange} />
  </div>
);

const CountryList = ({ countries, onShow }) => (
  <div>
    {countries.map((c) => (
      <div key={c.cca3}>
        {c.name.common}{" "}
        <button
          type="button"
          onClick={() => {
            console.log("Show clicked for:", c.name.common);
            onShow(c.name.common);
          }}
        >
          Show
        </button>
      </div>
    ))}
  </div>
);

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const capital = country.capital?.[0] ?? "";

  // OpenWeatheriin kannattaa käyttää pääkaupungin koordinaatteja jos löytyy
  const coords = useMemo(() => {
    if (country?.capitalInfo?.latlng?.length === 2) {
      const [lat, lon] = country.capitalInfo.latlng;
      return { lat, lon };
    }
    // fallback: maan yleiset koordinaatit
    if (country?.latlng?.length === 2) {
      const [lat, lon] = country.latlng;
      return { lat, lon };
    }
    return null;
  }, [country]);

  useEffect(() => {
    let cancelled = false;

    const fetchWeather = async () => {
      setError(null);
      setWeather(null);

      if (!coords) {
        console.log("Weather: no coordinates for", country.name.common);
        return;
      }

      console.log("Weather: fetching for", {
        country: country.name.common,
        capital,
        coords,
      });

      try {
        const data = await weatherService.getByLatLon(coords);

        if (cancelled) return;

        if (data === null) {
          // avain puuttuu
          setError("API key missing (VITE_OPENWEATHER_KEY).");
          console.log("Weather: api key missing");
          return;
        }

        console.log("Weather: success", {
          temp: data.main?.temp,
          wind: data.wind?.speed,
          icon: data.weather?.[0]?.icon,
        });

        setWeather(data);
      } catch (e) {
        if (cancelled) return;
        console.log("Weather: failed", e?.message ?? e);
        setError("Could not fetch weather.");
      }
    };

    fetchWeather();

    return () => {
      cancelled = true;
    };
  }, [coords, country.name.common, capital]);

  const apiKeyExists = Boolean(import.meta.env.VITE_OPENWEATHER_KEY);

  if (!apiKeyExists) {
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <div>Set VITE_OPENWEATHER_KEY and restart dev server.</div>
      </div>
    );
  }

  if (!coords) {
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <div>No coordinates available.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <div>{error}</div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div>
        <h2>Weather in {capital}</h2>
        <div>loading...</div>
      </div>
    );
  }

  const icon = weather.weather?.[0]?.icon;
  const iconUrl = icon
    ? `https://openweathermap.org/img/wn/${icon}@2x.png`
    : null;

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <div>temperature {weather.main?.temp} °C</div>
      {iconUrl && <img src={iconUrl} alt="weather icon" />}
      <div>wind {weather.wind?.speed} m/s</div>
    </div>
  );
};

const CountryDetails = ({ country }) => {
  console.log("Rendering details for country:", country.name.common);

  const languages = country.languages ? Object.values(country.languages) : [];
  const flagPng = country.flags?.png;
  const flagAlt = country.flags?.alt ?? `Flag of ${country.name.common}`;

  return (
    <div>
      <h1>{country.name.common}</h1>

      <div>Capital {country.capital?.[0] ?? ""}</div>
      <div>Area {country.area}</div>

      <h2>Languages</h2>
      <ul>
        {languages.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      {flagPng && <img src={flagPng} alt={flagAlt} />}

      <Weather country={country} />
    </div>
  );
};

export default function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    console.log("Fetching all countries...");
    countriesService
      .getAll()
      .then((data) => {
        console.log("Countries fetched:", data.length);
        setAllCountries(data);
      })
      .catch((e) => {
        console.log("Failed to fetch countries:", e?.message ?? e);
      });
  }, []);

  const matches = useMemo(() => {
    const q = filter.trim().toLowerCase();
    console.log("Filtering with query:", q);

    if (!q) return [];

    const result = allCountries.filter((c) =>
      c.name.common.toLowerCase().includes(q)
    );

    console.log("Matching countries:", result.length);
    return result;
  }, [filter, allCountries]);

  const handleShow = (countryName) => {
    console.log("Setting filter to country:", countryName);
    setFilter(countryName);
  };

  let content = null;

  if (filter.trim()) {
    if (matches.length > 10) {
      content = <div>Too many matches, specify another filter</div>;
    } else if (matches.length > 1) {
      content = <CountryList countries={matches} onShow={handleShow} />;
    } else if (matches.length === 1) {
      content = <CountryDetails country={matches[0]} />;
    } else {
      content = <div>No matches</div>;
    }
  }

  return (
    <div>
      <Filter
        value={filter}
        onChange={(e) => {
          console.log("Filter input changed:", e.target.value);
          setFilter(e.target.value);
        }}
      />
      {content}
    </div>
  );
}
