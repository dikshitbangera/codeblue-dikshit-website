// Define the AngularJS app
var app = angular.module("loginApp", []);
const errorMessageDiv = document.getElementById('error-message');

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
                    if (response.data.success) {
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
                        alert("An error occurred while processing your login request.");
                        console.error(error);
                    }
                });
        }
    };
});

async function logout() {
    try {
        const response = await fetch('http://localhost:3000/api/logout', { // Ensure URL matches backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            // Redirect to login page
            window.location.href = "index.html";
        } else {
            const errorResult = await response.json();
            alert(errorResult.message || 'Failed to logout. Please try again.');        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout.');
    }
}