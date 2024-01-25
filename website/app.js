
// Personal API Key for OpenWeatherMap API
const apiKey = '65af2bce30a9a3e63db609c74e6dbbc8';
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */

function performAction(e){
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;
    const newDate = new Date().toLocaleDateString();

    getWeatherData(baseURL, apiKey, zip)
    .then(function(data){
        console.log("Weather data:", data);

        postData('/add', { date: newDate, temperature: data.main.temp, content: feelings })
        .then(function(response) {
            console.log("POST response:", response);
            updateUI();// Update the UI with the most recent entry
        })
        .catch(function(error) {
            console.error("Error in POST request:", error);
        });
    })
    .catch(function(error) {
        console.error("Error in GET request for weather data:", error);
    });
};

// Function to GET Web API Data
const getWeatherData = async (baseURL , apiKey, zip) => {
    const response = await fetch(`${baseURL}${zip}&appid=${apiKey}`);
    try {
        const data = await response.json();
        return data;
    } catch(error) {
        console.log("error", error);
    }
};


/* Function to POST data */

const postData = async (url = '', data = {}) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
      
        if (!response.ok) {
            let errorMessage = "Failed to perform the POST request";
            try {
                const errorText = await response.text();
                if (errorText) {
                    errorMessage = errorText;
                }
                console.error("Error response text:", errorText); // Log the error response text
            } catch (error) {
                console.error("Error parsing error response:", error);
            }
            throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        return await response.json(); // Return the parsed JSON response
    } catch (error) {
        console.error("POST request error:", error);
        throw error; // Propagate the error to the calling code
    }
};
/*
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        return await response.json(); // Return the parsed JSON response
    } catch (error) {
      console.error("POST request error:", error);
        if (error.response) {
        const errorText = await error.response.text();
         console.error("Error response text:", errorText);
}
      throw error; // Propagate the error to the calling code


    }
}; */

/* Function to GET Project Data */
const updateUI = async () => {
    try {
        const request = await fetch('/all');

        if (!request.ok) {
            const errorMessage = await request.text();
            throw new Error(`Error ${request.status}: ${errorMessage}`);
        }

        const allData = await request.json();
        console.log("Project data:", allData);

        // Process and assign the data to the "Most Recent Entry" div
        document.getElementById('date').innerHTML = allData.date || 'No date available';
        document.getElementById('temp').innerHTML = allData.temperature
            ? Math.round(allData.temperature) + ' degrees'
            : 'No temperature available';
        document.getElementById('content').innerHTML = allData.userResponse || 'No user response available';
    } catch (error) {
        console.error("Error in GET request for project data:", error);
        throw error;
    }
};

