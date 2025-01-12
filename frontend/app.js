// Define the AngularJS app
var app = angular.module("loginApp", []);

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
            // Proceed with the login request
            $http.post('/login', $scope.user)
                .then(function(response) {
                    if (response.data.success) {
                        alert("Login successful!");
                    } else {
                        alert(response.data.message);
                    }
                })
                .catch(function(error) {
                    if (error.status === 401) {
                        alert("Invalid username or password");
                    } else {
                        alert("An error occurred. Please try again.");
                    }
                });
        }

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
                } else {
                    // Handle login failure
                    alert(response.data.message || "Invalid username or password.");
                }
            })
            .catch(function (error) {
                // Handle API errors
                alert("An error occurred while processing your login request.");
                console.error(error);
            });
    };
});

document.getElementById("logout-btn").addEventListener("click", () => {
    alert("You have logged out successfully!");
    window.location.href = "index.html"; // Redirect to login page
  });
  
  const popup = document.getElementById("video-popup");
  const popupBtn = document.getElementById("popup-btn");
  const closePopup = document.getElementById("close-popup");
  
  popupBtn.addEventListener("click", () => {
    popup.classList.remove("hidden");
  });
  
  closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
  });
  
