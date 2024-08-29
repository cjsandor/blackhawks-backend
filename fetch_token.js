const axios = require('axios');

axios.post('http://localhost:5000/api/login', {
  username: 'your_username',
  password: 'your_password'
})
.then(function (response) {
  console.log(response.data);
})
.catch(function (error) {
  console.error('Error:', error);
});