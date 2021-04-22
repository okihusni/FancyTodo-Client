$(document).ready(() => {

  $('#go-to-login').on('click', (e) => {
    e.preventDefault();
    $('#register').hide();
    $('#login').show();
  })

  $('#go-to-register').on('click', (e) => {
    e.preventDefault();
    $('#register').show();
    $('#login').hide();
  })
  
  isLoggedIn();

  $('#register-form').on('submit', (e) => {
    e.preventDefault();
    register();
  });
  
  $('#login-form').on('submit', (e) => {
    e.preventDefault();
    login();
  })
});

const register = () => {
  const email = $('#emailRegister').val();
  const password = $('#passwordRegister').val();

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/users/register',
    data: {
      email,
      password
    }
  })
  .done(() => {
    $('#emailRegister').val('');
    $('#passwordRegister').val('');
  })
  .fail(err => {
    const { errors } = err.responseJSON;
    console.log(errors);
  });
};

const isLoggedIn = () => {
  if(localStorage.getItem('access_token')) {
    $('#register').hide();
    $('#login').hide();
    $('#todos').show();
  }
  else {
    $('#register').show();
    $('#login').hide();
    $('#todo').hide();
  }
}

const login = () => {
  const email = $('#email').val();
  const password = $('#password').val();

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/users/login',
    data: {
      email,
      password
    }
  })
  .done(data => {
    const { access_token } = data;
    localStorage.setItem('access_token', access_token);
    $('#email').val('');
    $('#password').val('');
  })
  .fail(err => {
    const { errors } = err.responseJSON;
    console.log(errors);
  });
};