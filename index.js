$(document).ready(() => {
  
  isLoggedIn();

  $('#go-to-login').click((e) => {
    e.preventDefault();
    $('#register').hide();
    $('#login').show();
  })

  $('#go-to-register').click((e) => {
    e.preventDefault();
    $('#register').show();
    $('#login').hide();
  })
  
  $('#register-form').on('submit', (e) => {
    e.preventDefault();
    register();
  });
  
  $('#login-form').on('submit', (e) => {
    e.preventDefault();
    login();
  });
  
  $('#logout').click((e) => {
    e.preventDefault();
    logout();
  })
});

const isLoggedIn = () => {
  if (localStorage.getItem('access_token')) {
    $('#register').hide();
    $('#login').hide();
    $('#logout').show();
    $('#trivia').show();
    $('#receipt').show();
    $('#todos').show();
  }
  else {
    $('#register').hide();
    $('#login').show();
    $('#logout').hide();
    $('#trivia').hide();
    $('#receipt').hide();
    $('#todos').hide();
  };
};

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
  })
  .always(() => {
    isLoggedIn();
  });
};

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
  })
  .always(() => {
    isLoggedIn();
  });
};

const logout = () => {
  localStorage.removeItem('access_token');
  isLoggedIn();
}