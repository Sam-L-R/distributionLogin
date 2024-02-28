let loggedInUser; // Variable to store the logged-in user object

function loginAndActivate() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  let urlApi = document.getElementById("urlApi").value;

  // Add "/api/v1/" to the urlApi if it doesn't already contain it
  if (!urlApi.endsWith("/api/v1/")) {
    urlApi += "/api/v1/";
  }

  // Fetch request example
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "email": email,
    "password": password,
    "urlApi": `https://${urlApi}`
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://n8n.integracao.cloud/webhook/getUser", requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();

    })
    .then(user => {
      // Store the user object
      loggedInUser = user;
      var roles = user.roles;
      console.log(loggedInUser)

      // Display the activation/deactivation buttons only if the login and activation were successful
      document.getElementById('login').style.display = 'none';
      document.getElementById('activationButtons').style.display = 'block';


      document.getElementById('rolesList').style.display = 'block';
      // Get the element where you want to display the roles
      var rolesList = document.getElementById('rolesList');

      // Check if roles array is not empty
      if (roles.length > 0) {
        // Create a variable to store the HTML content
        var html = '';

        // Loop through each role in the array
        roles.forEach(function (role) {
          // Create the HTML for each role
          html += '<div class="role">' + role + '</div>';
        });

        // Set the innerHTML of the rolesList element to the generated HTML
        rolesList.innerHTML = 'Distribuição está ativa para:' + html;
      } else {
        // If roles array is empty, you can display a message or do something else
        rolesList.innerHTML = 'Nenhuma Distribuição ativa';
      }

    })
    .catch(error => {
      console.error('Error:', error.message);
      alert('Error: Senha incorreta, ou erro do servidor. Tente novamente.');
    });
}

function rolesActive() {

  document.getElementById('rolesList').style.display = 'block';
  // Get the element where you want to display the roles
  var rolesList = document.getElementById('rolesList');

  // Check if roles array is not empty
  if (roles.length > 0) {
    // Create a variable to store the HTML content
    var html = '';

    // Loop through each role in the array
    roles.forEach(function (role) {
      // Create the HTML for each role
      html += '<div class="role">' + role + '</div>';
    });

    // Set the innerHTML of the rolesList element to the generated HTML
    rolesList.innerHTML = 'Distribuição está ativa para:' + html;
  } else {
    // If roles array is empty, you can display a message or do something else
    rolesList.innerHTML = 'Nenhuma Distribuição ativa';
  }
}

function activateAccount() {
  if (loggedInUser) {
    // Show the department modal
    document.getElementById('departmentModal').style.display = 'block';
  } else {
    alert('Error: User not logged in.');
  }
}

function deactivateAccount() {
  if (loggedInUser) {
    // Show the deactivate modal
    document.getElementById('deactivateModal').style.display = 'block';
  } else {
    alert('Error: User not logged in.');
  }
}

function confirmDeactivation(modal) {
  // Get the selected reason from the dropdown
  var reason = document.getElementById('reason').value;

  if (reason === 'Outros') {
    // Prompt the user for a custom reason
    const customReason = prompt('Por favor informe o motivo:');
    if (customReason === null || customReason.trim() === '') {
      // User canceled or provided an empty reason
      alert('Por favor informe o motivo');
      return;
    }

    // Update the userBody with the custom reason
    var reason = customReason;
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var userBody = JSON.stringify({
    "user": loggedInUser,
    "reason": reason,
    "department": document.getElementById('selector1').value
  });

  var deactivateOptions = {
    method: 'POST',
    headers: myHeaders,
    body: userBody,
    redirect: 'follow'
  };

  fetch("https://n8n.integracao.cloud/webhook/deactivateUser", deactivateOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Add logic to handle successful deactivation
      return response.json();
    })
    .then(data => {
      alert('Deactivation response:\n' + JSON.stringify(data));
    })
    .catch(error => {
      console.error('Error:', error.message);
      alert('Error: Unable to deactivate account. Please try again.');
    });

  // Close the deactivate modal
  document.getElementById('deactivateModal').style.display = 'none';
  loginAndActivate()
}
function confirmDepartment() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var userBody = JSON.stringify({
    "user": loggedInUser,
    "department": document.getElementById('selector2').value
  });

  var activateOptions = {
    method: 'POST',
    headers: myHeaders,
    body: userBody,
    redirect: 'follow'
  };

  fetch("https://n8n.integracao.cloud/webhook/activateUser", activateOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Add logic to handle successful activation
      return response.json();
    })
    .then(data => {
      alert('Activation response:\n' + JSON.stringify(data));
    })
    .catch(error => {
      console.error('Error:', error.message);
      alert('Error: Unable to activate account. Please try again.');
    });
  document.getElementById('departmentModal').style.display = 'none';
  loginAndActivate()

}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Get the modal elements
var deactivateModal = document.getElementById('deactivateModal');
var departmentModal = document.getElementById('departmentModal');

// Close the modal if the user clicks outside of it
document.addEventListener('click', function (event) {
  if (event.target == deactivateModal) {
    deactivateModal.style.display = 'none';
  }
  if (event.target == departmentModal) {
    departmentModal.style.display = 'none';
  }
});