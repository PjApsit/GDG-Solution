import * as dotenv from 'dotenv';
import { getAggregatedExternalData } from './services/externalDataAggregation.js';
import fs from 'fs';

// Load the .env file so the API keys are available
dotenv.config();

const runTest = async () => {
  console.log("Starting Data Aggregation for Mumbai...");
  
  const result = await getAggregatedExternalData({
    city_name: "Mumbai",
    country_code: "in",
    // Not providing lat/lng so Nominatim will fetch it automatically!
    project_type: "food relief, disaster, medical emergency"
  });

  // Write the full result to a JSON file so it's easy to read
  fs.writeFileSync('aggregation-result.json', JSON.stringify(result, null, 2));
  
  console.log("\nAggregation complete! Summary of results:");
  console.log("---------------------------------------");
  console.log("Location found:", result.location ? result.location.display_name : "None");
  console.log("Weather fetched:", result.weather ? "Yes" : "No");
  console.log("AQI fetched:", result.aqi ? "Yes (AQI: " + result.aqi.data.aqi + ")" : "No");
  console.log("News fetched:", result.news ? `Yes (${result.news.results?.length || 0} articles)` : "No");
  
  if (result.errors.length > 0) {
    console.log("\nErrors encountered:");
    result.errors.forEach(err => console.log("-", err));
  }
  
  console.log("\nThe full data has been saved to 'server/aggregation-result.json'!");
};

runTest();
