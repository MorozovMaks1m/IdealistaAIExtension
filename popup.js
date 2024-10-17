// Wait for the DOM to fully load before adding the event listener
document.addEventListener("DOMContentLoaded", function () {
    // Select the button using its ID
    const button = document.getElementById("myButton");
    const textField = document.getElementById("myTextField");


    // Check if the current tab is Idealista
    chrome.runtime.sendMessage({ action: "checkIdealista" }, (response) => {
        if (response.isIdealista) {
            button.disabled = false; // Enable button if on Idealista
            button.classList.remove("disabled"); // Remove disabled class
            textField.style.display = 'block'; // Show text field
        } else {
            button.disabled = true; // Disable button if not on Idealista
            button.classList.add("disabled"); // Add disabled class
            textField.style.display = 'none'; // Hide text field
        }
    });

    // Add a click event listener to the button
    button.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const activeTab = tabs[0];
            if (activeTab) {
                const requestObj = {
                    link: activeTab.url
                };

                fetch('https://7e9b-34-125-54-3.ngrok-free.app/test', {
                    method: 'POST',
                    timeout: 120000,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestObj) // Convert the data to JSON
                })
                .then(response => {
                    if (!response.ok) {
                        textField.value = `!response.ok`;
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    textField.value = `response.ok`;
                    return response.json(); // Parse JSON response
                })
                .then(data => {
                    console.log("Response Data:", data); // Log the full response data
                    textField.value = `${data.summary || "No summary received"}`;
                    adjustHeight();
                })
                .catch(error => {
                    console.error('Error:', error);
                    textField.value = 'Failed to fetch data from FastAPI.';
                });
            }
        });
    });

    // Function to adjust the height of the textarea
    function adjustHeight() {
        // Reset height to allow for proper resizing
        textField.style.height = 'auto';
        // Set height based on scrollHeight (the height of the content)
        textField.style.height = textField.scrollHeight + 'px';
    }
});
