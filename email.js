
  (function() {
    emailjs.init("pw-m5IQxSSfuEdLuY"); // Initialize Email.js with your Public Key
  })();

    document.getElementById("contactForm").addEventListener("submit", function(event) {
      event.preventDefault(); // Prevent default form submission
  
      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;
  
      // Define Email.js template parameters
      const templateParams = {
        name: name,
        email: email,
        message: message
      };
  
      // Send email via Email.js
      emailjs
        .send("service_468htac", "template_mkjyxui", templateParams)
        .then(
          function(response) {
            console.log("SUCCESS!", response.status, response.text);
            document.getElementById("formResponse").style.display = "block";
            document.getElementById("formResponse").style.color = "green";
            document.getElementById("formResponse").textContent =
              "Message sent successfully!";
            document.getElementById("contactForm").reset(); // Clear the form
          },
          function(error) {
            console.error("FAILED...", error);
            document.getElementById("formResponse").style.display = "block";
            document.getElementById("formResponse").style.color = "red";
            document.getElementById("formResponse").textContent =
              "Failed to send message. Please try again later.";
          }
        );
    });
