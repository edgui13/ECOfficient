document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-btn');

    loginForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent the form from submitting and refreshing the page
      const username =document.getElementById('username');
      const password =document.getElementById('password');
      const usernameLogin = username.value.trim();
      const passwordLogin = password.value.trim();

      if(usernameLogin && passwordLogin){
      sessionStorage.setItem('username', username);
      sessionStorage.setItem('password', password);
      // You can add your logic here to validate the username and password
  
      window.location.href = 'index.html'; // Redirect the user to the index.html page
      }
    });
    
  });
  