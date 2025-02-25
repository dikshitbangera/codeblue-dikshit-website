// Define the AngularJS app
const app = angular.module("loginApp", []);
const errorMessageDiv = document.getElementById('error-message');

//Adding another comment here
// Define the login controller
app.controller("loginController", function ($scope, $http) {
    // User object to bind form inputs
    $scope.user = {};

    // Function to handle form submission
    $scope.submitLogin = function () {
        // Check if username and password are entered
        if (!$scope.user.username || !$scope.user.password) {
            alert("Please enter both username and password.");
        } else {
            // API endpoint for login (update with your backend URL)
            var loginApiUrl = "http://localhost:3000/api/login";

            // POST request to the login API
            $http.post(loginApiUrl, $scope.user)
                .then(function (response) {
                    // Handle successful response
                    if (response.data.token) {
                        localStorage.setItem("jwtToken", response.data.token);
                        alert(response.data.message || "Login successful!");
                        // Redirect to the welcome page
                        window.location.href = "welcome.html";
                    }
                })
                .catch(function (error) {
                    // Handle API errors
                    if (error.status === 401) {
                        // Update the UI with an error message
                        const errorMessageDiv = document.getElementById("error-message");
                        errorMessageDiv.style.display = "block";
                        errorMessageDiv.textContent = "Invalid Username or Password.";
                    } else {
                        alert(`Error ${error.status}: ${error.data.message || "An error occurred while processing your login request."}`);
                        console.error(error);
                    }
                });
        }
    };
});


function isTokenExpired(token) {
    // Decode JWT payload
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
}

// Function to fetch protected data using the stored JWT token
async function getProtectedData() {
    const token = localStorage.getItem("jwtToken");
    if (!token || isTokenExpired(token)) {
        alert("Session expired. Please log in again.");
        logout(); // Optionally clear token and redirect
        return;
    }
    

    try {
        const response = await fetch("http://localhost:3000/api/protected", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Protected Data:", data);
        } else {
            alert("Access denied or token expired. Please log in again.");
        }
    } catch (error) {
        console.error("Error fetching protected data:", error);
    }
}

/**
 * Logs out the user by invalidating the session on the server and clearing the local token.
 */
async function logout() {

    const token = localStorage.getItem("jwtToken");

    if (!token) {
        alert("No token found. You are not logged in.");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/logout', { // Ensure URL matches backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
        });

        if (response.ok) {
            const result = await response.json();
            localStorage.removeItem("jwtToken"); // Clear the token from storage
            alert(result.message);
            // Redirect to login page
            window.location.href = "index.html";
        } else {
            const errorResult = await response.json();
            alert(errorResult.message || 'Failed to logout. Please try again.');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout.');
    }
}