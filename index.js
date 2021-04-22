$(document).ready(() => {
  $('#register-form').on('submit', (e) => {
    e.preventDefault();
    register();
  });
});

const register = () => {
  const inputEmailRegister = $('#emailRegister');
  const inputPassRegister = $('#passwordRegister');

  $.ajax({
    method: 'post',
    url: 'http://localhost:3000/users/register',
    data: {
      email = inputEmailRegister.val(),
      password = inputPassRegister.val()
    }
  })
  .done(data => {
    console.log(data);
  })
  .fail(err => {
    console.log(err);
  });
};