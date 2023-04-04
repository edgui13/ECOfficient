// Add this code to the existing results.js file

const savingsRanked = document.getElementById('savings-ranked');
const savingsData = [];
var weather;
var temp;
var mode;
var county = "Washington";
var country = "United States";
var getDist = 0;


function getWeather(part1, part2, part3, part4)
{

	let url = "https://wttr.in/" + part1 + "," + part2 + "," + part3 + "?format=j1";
	console.log(url);

	var httpREQ = new XMLHttpRequest();
	httpREQ.open("GET", url, false);
	httpREQ.send(null);

	return (httpREQ.responseText);
}

// results.js

document.addEventListener('DOMContentLoaded', () => {  
    var json_obj = JSON.parse(getWeather(sessionStorage.getItem("startLocation").split(', ')[0], county, sessionStorage.getItem("startLocation").split(', ')[1], country));
    startTemp = json_obj.current_condition[0].temp_F;
    startCondition = json_obj.current_condition[0].weatherDesc[0].value;
    var json_obj2 = JSON.parse(getWeather(sessionStorage.getItem("endLocation").split(', ')[0], county, sessionStorage.getItem("endLocation").split(', ')[1], country));
    endTemp = json_obj2.current_condition[0].temp_F;
    endCondition = json_obj2.current_condition[0].weatherDesc[0].value;

    const conditionsSaved = document.getElementById('conditions-saved');
    conditionsSaved.innerHTML = `Start: ${startTemp}°F ${startCondition} | End: ${endTemp}°F ${endCondition}`;
  
    const startWeatherImage = document.getElementById('start-weather-image');
    const endWeatherImage = document.getElementById('end-weather-image');

    startWeatherImage.src = getWeatherImage(startCondition);
    endWeatherImage.src = getWeatherImage(endCondition);
});
  

function initMap() {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 14,
      center: { lat: 37.77, lng: -94}, 
    });
  
    directionsRenderer.setMap(map);

    //get start and end location from sessionStorage
    const startLocation = sessionStorage.getItem("startLocation");
    const endLocation =  sessionStorage.getItem("endLocation");

    calculateAndDisplayRoute(directionsService, directionsRenderer, startLocation, endLocation);

    document.getElementById("mode").addEventListener("change", () => {
      calculateAndDisplayRoute(directionsService, directionsRenderer, startLocation, endLocation);
    });
}
  
  function calculateAndDisplayRoute(directionsService, directionsRenderer, start, end) {
    const selectedMode = document.getElementById("mode").value;
    mode = selectedMode;
  
    directionsService
      .route({
        origin: start,
        destination:end,
        travelMode: google.maps.TravelMode[selectedMode],
      })
      .then((response) => {
        directionsRenderer.setDirections(response);

        // Calculate the distance between the two locations
        const route = response.routes[0].legs[0];
        const distance = route.distance.value;
        //getDist = distance;

        calculateEmissionsAndFuelSaved(distance);
      })


      .catch((e) => window.alert("Directions request failed due to " + status));
}

  
  function calculateEmissionsAndFuelSaved(distanceInMeters) {
    // Convert distance from meters to miles
    const mpg = 25;
    const gasCoLb = 19.5924972;
    const distanceInMiles = distanceInMeters * 0.000621371;
    distance = distanceInMiles;

    findSolution((distance));

// Sort the data in descending order based on savings
savingsData.sort((a, b) => b.savings - a.savings);

// Populate the list items
savingsData.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${item.mode} - ${item.savings}% savings`;
    savingsRanked.appendChild(listItem);
});
    getDist = distanceInMiles;
    sessionStorage.setItem('storeDist', getDist);
  
    // Placeholder calculations
    var multi;
    if(mode == 'WALKING' || mode == 'BICYCLING'){
        multi = 0;
    }else if(mode == 'TRANSIT'){
        multi = 0.55;
    }else{
        multi = 1;
    }
    const emissionResults = ((distanceInMiles * gasCoLb) / mpg) * multi; // Replace with your own calculation
    fuelSaved = distanceInMiles / mpg; 
  
    // Display the results in the respective elements
    document.getElementById("emission-results").innerText = `${emissionResults.toFixed(2)} lb CO2`;
    document.getElementById("fuel-saved").innerText = `${fuelSaved.toFixed(2)} gal`;
    document.getElementById("distance").innerText = `${distanceInMiles.toFixed(1)} Miles`;
    document.getElementById("distance").innerText = `${distanceInMiles.toFixed(2)} Miles`;
  }

  
    window.initMap = initMap;

    //const dist = sessionStorage.getItem("storeDist");
    //console.log(dist);
    //findSolution(dist);

    //////////////////
function getWeatherImage(weatherCondition){
  let imageURL;

  switch(weatherCondition.toLowerCase()){
    case 'partly cloudy':
    case 'cloudy':
    case 'overcast':
    case 'partly sunny':
      imageURL = 'images/Cloudy.png';
      break;
    case 'clear':
    case 'sunny':
        imageURL = 'images/Sun.png';
        break;
    case 'rain':
    case 'showers':
    case 'light rain':
        imageURL = 'images/Rainy.png';
        break;
    case 'snow':
    case 'sleet':
        imageURL = 'images/Snow.png';
        break;
    default:
      imageURL = 'images/Sun.png';
  }
  return imageURL;
}


function findSolution(travelLength){
    console.log(travelLength);
    acceptable = false;
    shortTrav = 10;
    medTrav = 15;
    minTemp = 40;
    maxTemp = 85;
    //calculate carbon emisisons savings in grams
    walkSav = 100;
    pubSav = 55;
    carCost = 0;
    savingsData.length = 0;
    
    var json_obj = JSON.parse(getWeather(sessionStorage.getItem("startLocation").split(', ')[0], county, sessionStorage.getItem("startLocation").split(', ')[1], country));
    temp = json_obj.current_condition[0].temp_F;
    weather = json_obj.current_condition[0].weatherDesc[0].value;
    console.log(weather);
    if(temp > minTemp && temp < maxTemp){
        if(weather == 'Partly cloudy' || weather == 'Clear' || weather == "Overcast" || weather == "Sunny" || weather == 'Cloudy' || weather == 'Partly sunny')
        {
      
            acceptable = true;
        }
    }
    console.log(acceptable);

    if(acceptable){
        if(travelLength <= shortTrav){
          document.getElementById("message").innerText = "A great day for a walk!";
          document.getElementById("alt-1").innerText = "Walking 100%";
          document.getElementById("alt-2").innerText = "Biking 100%";
          document.getElementById("alt-3").innerText = "Public Transit 55%";
          document.getElementById("alt-4").innerText = "Carpooling 55%";
          document.getElementById("alt-5").innerText = "Driving 0%";
        }
        else if(travelLength <= medTrav && travelLength > shortTrav){
          document.getElementById("message").innerText = "Great weather for a bike ride!";
          document.getElementById("alt-1").innerText = "Biking 100%";
          document.getElementById("alt-2").innerText = "Public Transit 55%";
          document.getElementById("alt-3").innerText = "Carpooling 55%";
          document.getElementById("alt-4").innerText = "Driving 0%";
          document.getElementById("alt-5").innerText = "";
        }else{
          document.getElementById("message").innerText = "Long trip today. Try carpooling with some friends!";
          document.getElementById("alt-1").innerText = "Carpooling 55%";
          document.getElementById("alt-2").innerText = "Driving 0%";
          document.getElementById("alt-3").innerText = "";
          document.getElementById("alt-4").innerText = "";
          document.getElementById("alt-5").innerText = "";
        }
    }else{
      document.getElementById("message").innerText = "Not great weather today unfortunately.";
      document.getElementById("alt-1").innerText = "Carpooling 55%";
      document.getElementById("alt-2").innerText = "Driving 0%";
      document.getElementById("alt-3").innerText = "";
      document.getElementById("alt-4").innerText = "";
      document.getElementById("alt-5").innerText = "";
    }
}

// Get the back button element
const backButton = document.getElementById('back-button');

// Add event listener for the click event
backButton.addEventListener('click', () => {
  // Navigate back to index.html
  window.location.href = 'index.html';
});


// Sort the data in descending order based on savings
savingsData.sort((a, b) => b.savings - a.savings);

// Populate the list items
savingsData.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}. ${item.mode} - ${item.savings}% carbon reduction`;
    savingsRanked.appendChild(listItem);
});
