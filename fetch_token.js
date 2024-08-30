// File: blackhawks-backend/fetch_token.js

const axios = require('axios');

axios.post('http://localhost:5000/api/auth/login', {
  email: 'admin@example.com',
  password: 'password123'
})
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.error('Error:', error);
});