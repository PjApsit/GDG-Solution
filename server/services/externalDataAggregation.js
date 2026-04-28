/**
 * Service to aggregate data from external APIs.
 * This can be used to gather context to feed into an LLM (e.g., Gemini).
 */

/**
 * Get aggregated context data
 * @param {Object} params
 * @param {string} params.city_name - The city name (e.g., "Mumbai")
 * @param {string} [params.country_code] - The country code (e.g., "IN", "in"). Use lowercase for NewsData API.
 * @param {number} [params.lat] - Latitude. Will be fetched via Nominatim if not provided.
 * @param {number} [params.lng] - Longitude. Will be fetched via Nominatim if not provided.
 * @param {string} [params.project_type] - e.g., "flood relief", "health", "food"
 * @returns {Promise<Object>} The aggregated API responses
 */
export const getAggregatedExternalData = async ({
  city_name,
  country_code = '',
  lat,
  lng,
  project_type = ''
}) => {
  const results = {
    location: null,
    weather: null,
    aqi: null,
    news: null,
    errors: []
  };

  try {
    // 1. OpenStreetMap (Nominatim)
    // Call this to get location details or to get lat/lng if missing
    if (city_name) {
      const nominatimUrl = new URL('https://nominatim.openstreetmap.org/search');
      nominatimUrl.searchParams.append('q', city_name);
      if (country_code) nominatimUrl.searchParams.append('countrycodes', country_code);
      nominatimUrl.searchParams.append('format', 'jsonv2');
      nominatimUrl.searchParams.append('limit', '1');
      nominatimUrl.searchParams.append('addressdetails', '1');

      try {
        const response = await fetch(nominatimUrl.toString(), {
          headers: {
            'User-Agent': 'NGODecisionIntelligenceApp/1.0'
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            results.location = data[0];
            if (!lat) lat = parseFloat(data[0].lat);
            if (!lng) lng = parseFloat(data[0].lon);
          }
        } else {
          results.errors.push(`Nominatim Error: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        results.errors.push(`Nominatim Request Failed: ${err.message}`);
      }
    }

    // Require lat, lng for Weather and AQI
    if (lat !== undefined && lng !== undefined) {
      // 2. Open-Meteo
      try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&current=temperature_2m,relative_humidity_2m&forecast_days=7&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl);
        if (weatherResponse.ok) {
          results.weather = await weatherResponse.json();
        } else {
          results.errors.push(`Open-Meteo Error: ${weatherResponse.status} ${weatherResponse.statusText}`);
        }
      } catch (err) {
        results.errors.push(`Open-Meteo Request Failed: ${err.message}`);
      }

      // 3. WAQI API
      const waqiKey = process.env.WAQI_API_KEY;
      if (waqiKey) {
        try {
          const waqiUrl = `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${waqiKey}`;
          const waqiResponse = await fetch(waqiUrl);
          if (waqiResponse.ok) {
            results.aqi = await waqiResponse.json();
          } else {
            results.errors.push(`WAQI Error: ${waqiResponse.status} ${waqiResponse.statusText}`);
          }
        } catch (err) {
          results.errors.push(`WAQI Request Failed: ${err.message}`);
        }
      } else {
        results.errors.push("WAQI_API_KEY is not set in environment variables.");
      }
    } else {
      results.errors.push("Latitude and Longitude are missing/unresolved, skipping Weather and AQI APIs.");
    }

    // 4. NewsData API
    const newsKey = process.env.NEWSDATA_API_KEY;
    if (newsKey) {
      try {
        let newsQuery = city_name || 'India';
        const pType = project_type.toLowerCase();
        
        // Build combined keywords array based on all matching types
        const keywords = [];
        if (pType.includes('flood') || pType.includes('rain') || pType.includes('disaster')) {
          keywords.push('flood', 'rain', 'disaster');
        }
        if (pType.includes('health') || pType.includes('medical') || pType.includes('outbreak') || pType.includes('emergency')) {
          keywords.push('hospital', 'disease', 'outbreak', 'medical');
        }
        if (pType.includes('food') || pType.includes('hunger') || pType.includes('relief')) {
          keywords.push('shortage', 'hunger', 'slum', 'food');
        }

        if (keywords.length > 0) {
          // NewsData API accepts AND / OR operators. Let's combine them safely.
          // Limit to max 4 keywords to avoid exceeding 100 characters limit
          const limitedKeywords = keywords.slice(0, 4);
          newsQuery = `"${city_name}" AND (${limitedKeywords.join(' OR ')})`;
        } else if (pType) {
          // If no specific predefined categories matched, use their exact words as OR conditions
          // Limit custom words to avoid exceeding 100 char limit
          const customKeywords = pType.split(/[\s,]+/).filter(Boolean).slice(0, 4).join(' OR ');
          if (customKeywords) {
            newsQuery = `"${city_name}" AND (${customKeywords})`;
          }
        }

        const newsUrl = new URL('https://newsdata.io/api/1/latest');
        newsUrl.searchParams.append('apikey', newsKey);
        newsUrl.searchParams.append('q', newsQuery);
        
        if (country_code) {
            // NewsData.io expects lowercase 2-letter country code like "in"
            newsUrl.searchParams.append('country', country_code.toLowerCase());
        }
        
        newsUrl.searchParams.append('language', 'en');
        newsUrl.searchParams.append('size', '5');

        const newsResponse = await fetch(newsUrl.toString());
        if (newsResponse.ok) {
          results.news = await newsResponse.json();
        } else {
          // Attempt to parse json error if available
          let errorText = newsResponse.statusText;
          try {
             const errorData = await newsResponse.json();
             errorText = JSON.stringify(errorData);
          } catch(e) {}
          results.errors.push(`NewsData Error: ${newsResponse.status} ${errorText}`);
        }
      } catch (err) {
        results.errors.push(`NewsData Request Failed: ${err.message}`);
      }
    } else {
      results.errors.push("NEWSDATA_API_KEY is not set in environment variables.");
    }

  } catch (error) {
    results.errors.push(`Aggregation Process Error: ${error.message}`);
  }

  return results;
};

export default {
  getAggregatedExternalData
};
