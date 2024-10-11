// src/utils.js
export const parseDescription = (description) => {
    try {
      const descriptionText = description.split("Condiciones meteorológicas:")[0].trim();
      const conditionsText = description.split("Condiciones meteorológicas:")[1];
  
      if (!conditionsText) {
        return {
          description: descriptionText,
          weather: {
            temperature: 'No disponible',
            precipitation: 'No disponible',
            windSpeed: 'No disponible',
            humidity: 'No disponible',
            cloud: 'No disponible',
            uv: 'No disponible',
          }
        };
      }
  
      const weatherData = JSON.parse(conditionsText);
      const currentWeather = weatherData.current;
  
      return {
        description: descriptionText,
        weather: {
          temperature: currentWeather?.temp_c ?? 'No disponible',
          precipitation: currentWeather?.precip_mm ?? 'No disponible',
          windSpeed: (currentWeather?.wind_kph ?? 0).toFixed(2),
          humidity: currentWeather?.humidity ?? 'No disponible',
          cloud: currentWeather?.cloud ?? 'No disponible',
          uv: currentWeather?.uv ?? 'No disponible',
        }
      };
    } catch (error) {
      console.log("Error parsing description:", error);
      return {
        description: description,
        weather: {
          temperature: 'No disponible',
          precipitation: 'No disponible',
          windSpeed: 'No disponible',
          humidity: 'No disponible',
          cloud: 'No disponible',
          uv: 'No disponible',
        }
      };
    }
  };
  