// 1. Wrap the callback-based API in a Promise so you can await it
function getLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Resolve the promise with the coordinates
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error(`Error (${error.code}): ${error.message}`);
          reject(error);
        },
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      reject(new Error("Not supported"));
    }
  });
}

async function getCityAndState(latitude, longitude) {
  // Use format=jsonv2 for better address structure alignment
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`;
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "MyWebLocationApp/1.0" },
    });
    const data = await response.json();

    // Fallbacks to capture city data accurately
    const city =
      data.address.city ||
      data.address.town ||
      data.address.village ||
      data.address.municipality ||
      data.address.suburb;
    const state = data.address.state;

    console.log(`City: ${city}`);
    console.log(`State: ${state}`);

    return { city, state };
  } catch (error) {
    console.error("Error fetching location data:", error);
  }
}

// 2. Execute the sequence inside a main async orchestrator function
async function main() {
  try {
    // Await the coordinates
    const coordinates = await getLocation();
    console.log("Got coordinates:", coordinates);

    // Pass coordinates directly to your API function
    const locationData = await getCityAndState(
      coordinates.latitude,
      coordinates.longitude,
    );

    // Now you have your final city and state data!
    locationField.innerText = `${locationData.city}, ${locationData.state}`;
    console.log("Final Location Data Object:", locationData);
  } catch (error) {
    console.error("Pipeline failed:", error);
  }
}
const locationField = document.getElementById("locationField");
main().then((locationData) => {});