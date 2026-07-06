function uploadAndIdentifyPlantID (){
  // Get the photo from the front end
  const photoInput = document.getElementById("photoInput");

  // If no photo was selected and the user clicks on submit
  // Alerts the user to upload a photo
  if(photoInput.files.length === 0){
    alert("Please select a photo to upload.");
    return;
  }

  // Select the first file from the file arrays of an input element.
  const selectedFile = photoInput.files[0];

  // Create a new file reader object so we can rea file contents.
  const reader = new FileReader();

  // Trigger the onload event when the reading operation of a file is completed.
  reader.onload = function (e) {
    // Store the base64Image in a variable
    const base64Image = e.target.result;
    console.log('base64Image', base64Image);
    // Store Variables for the API call
    const apiKey = 'nbvq0gJUFaBSR8wGMO95CdjmVJP00mtzhpcVw04SFGLonnPPpg'
    const latitude = 49.207;
    const longitude = 16.608;
    const health = 'all';
    const similarImages = true;
    const details = 'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods,treatment,cause'
    const language = 'en'
    const apiUrlPlantID = `https://plant.id/api/v3/`;

    // Make first API CALL with our base64Image
    axios.post (apiUrlPlantID, {
      "images": [base64Image],
      "latitude": latitude,
      "longitude": longitude,
      "health": health,
      "similar_images": similarImages
    }, {
        headers: {
          "Api-Key": apiKey,
          "Content-Type": "application/json"
        }
    })
    // This is the pending state of the promise.
    .then(function (response) {
      console.log('Response from Plant ID API:', response.data);
      displayPlantIDInfo(response.data, base64Image)
    })
    
    // This is the error state of the promise.
    .catch(function (error){
      alert(`Error: ${error.response.data} XXX`)
      console.error('Error:', error);
    });
  };

  // Read the selected file as a data URL - a base64 encoded representation
  // of the file's content
  reader.readAsDataURL(selectedFile);  
}


// Display function for the plant ID info
function displayPlantIDInfo(plantIdResponse, base64Image){
  // Variable to store the first suggestion.
  const plantIdClassification = plantIdResponse.result.classification;
  const plantIdDisease = plantIdResponse.result.disease;
  const plantIdIsHealthy = plantIdResponse.result.is_healthy;
  const plantIdIsPlant = plantIdResponse.result.is_plant;


  // Plan preview image.
  // Grab the previewImage element from the front plantidentifier.html file.
  const previewImage = document.getElementById('previewImage')
  previewImage.src = base64Image


  // Plant Name
  // Grab the html for the plant title container.
  const plantNameContainer = document.getElementById('plant-name-container');
  // Create a new <p> tag for the plant title.
  const plantNameElement = document.createElement('p');
  // Add the name of the plant to the innerHtml of the new p tag.
  plantNameElement.innerHTML = `<strong>Name:</strong> ${plantIdClassification.suggestions[0].name}`
  // Append the new div to the api result container we grabbed from html.
  plantNameContainer.appendChild(plantNameElement);

  // Similar Images
  // Grab the similar image from the API Response.
  const plantSimiliarImage = plantIdClassification.suggestions[0].similar_images[0].url;
  // Grab the HTML where the image will be placed.
  const similiarImageHTML = document.getElementById('plant-similiar-image');
  // Set the image HTML src attribute to the image.
  similiarImageHTML.src = plantSimiliarImage;


  // Probability - Grab the score from the API Response
  const probabilityOfPlant = plantIdClassification.suggestions[0].probability;
  // Grab the HTML where the probability will be placed.
  const probabilityNameContainer = document.getElementById('probability-container');
  // Create a new p tag for the probability text.
  const probabilityNameElement = document.createElement('p');
  // Add the probability text to the innerHTML of the new p tag.
  probabilityNameElement.innerHTML = `<strong> Probability: </strong> ${probabilityOfPlant}`;
  // Append the new div we created.
  probabilityNameContainer.appendChild(probabilityNameElement);

// Is plant section?
// Grab the is plant boolean value from our API response.
const isPlant = plantIdIsPlant.binary;
// Grab the html where the boolean will be placed.
const isPlantContainer = document.getElementById('isPlant-container');
// Create a new p tag for the is plant boolean
const isPlantElement = document.createElement('p');
// Check to see if the submitted picture is a plant; if not, alert user
if (isPlant === false){
  alert('The picture you submitted is not a plant. Please try again.')
  window.location.reload();
}
// Add the boolean to the innerHTML of the new p tag created.
isPlantElement.innerHTML = `<strong> Is Plant: </strong>${isPlant}`;
// Append the new div we created.
isPlantContainer.appendChild(isPlantElement);

// Common name - grab the first common name from the API response
const commonName = plantIdClassification.suggestions[0].details.common_names[0];
// Grab the HTMl where the common name will be placed.
const commonNameContainer = document.getElementById('common-name-container');
// Create a new <p> tag element.
const commonNameElement = document.createElement('p');
// Add the common name to the innterHTML of the new p tag created.
commonNameElement.innerHTML = `<strong> Common Name: </strong> ${commonName}`;
// Append the new div we created
commonNameContainer.appendChild(commonNameElement);

// Description - grab value from the API response.
const plantDescription = plantIdClassification.suggestions[0].details.description.value;
// Grab container from the front end HTML.
const descriptionContainer = document.getElementById('description-container');
// Create a new <p> tag element.
const descriptionElement = document.createElement ('p');
// Add text to the innterHTML of the new p tag created.
descriptionElement.innerHTML = `<strong> Description: </strong> ${plantDescription}`;
// Append the new div we created.
descriptionContainer.appendChild(descriptionElement);


// Plant Health Status - grab value from the API response.
const plantHealthStatus = plantIdIsHealthy.binary;
// Grab container from the front end HTML.
const plantHealthStatusContainer = document.getElementById('plant-health-status-container');
// Create a new <p> tag element.
const plantHealthStatusElement = document.createElement('p');
// Add text to the innerHTML of the new p tag created.
plantHealthStatusElement.innerHTML = `<strong> Is Plant Healthy: </strong> ${plantHealthStatus}`;
// Append the new div we created.
plantHealthStatusContainer.appendChild(plantHealthStatusElement);

// Similar Image with Disease
// Grab the similar image from the API Response
const plantSimiliarImageWithDisease = plantIdDisease.suggestions[0].similar_images[0].url;
// Grab the HTML where the image will be placed.
const similiarImageWithDiseaseHTML = document.getElementById('plant-similiar-image-with-disease');
// Set the image HTML src attribute to the image
similiarImageWithDiseaseHTML.src = plantSimiliarImageWithDisease;

// Disease Name - grab value from the API response.
const plantDiseaseName = plantIdDisease.suggestions[0].name;
// Grab container from the front end HTML.
const plantDiseaseNameContainer = document.getElementById('plant-disease-name-container');
// Create a new <p> tag element.
const plantDiseaseNameElement = document.createElement('p');
// Add text to the innerHTML of the new p tag created.
plantDiseaseNameElement.innerHTML = `<strong> Disease: </strong> ${plantDiseaseName}`;
// Append the new div we created.
plantDiseaseNameContainer.appendChild(plantDiseaseNameElement);

// Disease Probability - grab value from the API response.
const plantDiseaseProbability = plantIdDisease.suggestions[0].probability;
// Grab container from the front end HTML.
const plantDiseaseProbabilityContainer = document.getElementById('plant-disease-probability-container');
// Create a new <p> tag element.
const plantDiseaseProbabilityElement = document.createElement('p');
// Add text to the innterHTML of the new p tag created.
plantDiseaseProbabilityElement.innerHTML = `<strong> Disease Probability: </strong> ${plantDiseaseProbability}`;
// Append the new div we created.
plantDiseaseProbabilityContainer.appendChild(plantDiseaseProbabilityElement);



// Disease Description - grab value from the API response.
const plantDiseaseDescription = plantIdDisease.suggestions[0].details.description;
// Grab container from the front end HTML.
const plantDiseaseDescriptionContainer = document.getElementById('plant-disease-description');
// Create a new <p> tag element.
const plantDiseaseDescriptionElement = document.createElement('p');
// Add text to the innterHTML of the new p tag created.
plantDiseaseDescriptionElement.innerHTML = `<strong> Disease Description: </strong> ${plantDiseaseDescription}`;
// Append the new div we created.
plantDiseaseDescriptionContainer.appendChild(plantDiseaseDescriptionElement);

// Disease Treatment
// Grab value from API response
const plantDiseaseTreatment = plantIdDisease.suggestions[0].details.treatment;
// Grab the container from the front end HTML 
const plantDiseaseTreatmentContainer = document.getElementById('plant-disease-treatment');
// Create a new p tag element
const plantDiseaseTreatmentElement = document.createElement('p');


//  Do a check if the plant is dead / object is empty
// We let the user know there is no treatment available for dead plants
if(Object.keys(plantDiseaseTreatment).length === 0){
  // Add text to the innerHTML of the new key tag created
  plantDiseaseTreatmentElement.innerHTML = `<strong> Disease Treatment: </strong> No treatment available.`;
  plantDiseaseTreatmentContainer.appendChild(plantDiseaseTreatmentElement);
}

// For loop through the object and will map the various keys to their assigned values then attach them to their HTML containers.
for(const key in plantDiseaseTreatment){
  // If the object has a key value pair
  if(plantDiseaseTreatment.hasOwnProperty(key)){
    // Create a variable that matches the key with the values and wrap them in HTML.
    const plantDiseaseTreatmentValues = plantDiseaseTreatment[key].map(value => `<li>${value}</li>`).join('');
    const plantDiseaseTreatmentText = `<strong> Disease Treatment ${key}: </strong> <ul>${plantDiseaseTreatmentValues}</ul>`;
    // Append the test of the key value pairs into the HTML container
    plantDiseaseTreatmentContainer.innerHTML += plantDiseaseTreatmentText;
  }
}
}
