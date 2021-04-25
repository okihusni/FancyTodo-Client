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
  
  $('#logout-btn').click((e) => {
    e.preventDefault();
    logout();
  });

  $('#todo-form').on('submit', (e) => {
    e.preventDefault();
    addTodo();
  });

  $('#todo-list-btn').click((e) => {
    e.preventDefault();
    $('#todos').hide();
    $('#getTodo').show();
    $('#todo-list-btn').hide();
    $('#add-todo-btn').show();
    getTodos();
  })

  $('#add-todo-btn').click((e) => {
    e.preventDefault();
    $('#todos').show();
    $('#getTodo').hide();
    $('#todo-list-btn').show();
    $('#add-todo-btn').hide();
  })
});

const isLoggedIn = () => {
  if (localStorage.getItem('access_token')) {
    $('#register').hide();
    $('#login').hide();
    $('#logout-btn').show();
    $('#todo-list-btn').hide();
    $('#add-todo-btn').show();
    $('#trivia').show();
    $('#receipt').show();
    $('#todos').hide();
    $('#getTodo').show();
    getTodos();
  }
  else {
    $('#register').hide();
    $('#login').show();
    $('#logout-btn').hide();
    $('#todo-list-btn').hide();
    $('#add-todo-btn').hide();
    $('#trivia').hide();
    $('#receipt').hide();
    $('#todos').hide();
    $('#getTodo').hide();
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
};

const addTodo = () => {
  const title = $('#title').val();
  const description = $('#description').val();
  const due_date = $('#due-date').val();
  const status = $("input[type='radio'][name='status']:checked").val();

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/todos',
    headers: {
      access_token: localStorage.getItem('access_token')
    },
    data: {
      title,
      description,
      due_date,
      status
    }
  })
  .done(() => {
    $('#title').val('');
    $('#description').val('');
    $('#due-date').val('');
    $("input[type='radio'][name='status']").prop('checked', false);
  })
  .fail(err => {
    const { errors } = err.responseJSON;
    console.log(errors);
  });
};

const getTodos = () => {
  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/todos/',
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
  .done(data => {
    console.log(data.data);
    $('#todo-list').empty();
    data.data.forEach(todo => {
      let due_date = new Date(todo.due_date).toISOString().split('T')[0]
      
      $('#todo-list').append(`
        <li id="todo">
          todo ${todo.id}:
          <ul>
            <li>title: ${todo.title}</li>
            <li>description: ${todo.description}</li>
            <li>due date: ${due_date}</li>
            <li>status: ${todo.status}</li>
          </ul>
        </li>
      `)
    });
  })
  .fail(err => {
    const { errors } = err.responseJSON;
    console.log(errors);
  })
  .always();
}