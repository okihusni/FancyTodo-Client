$(document).ready(() => {
  isLoggedIn();

  $('#login-form').on('submit', (e) => {
    e.preventDefault();
    login();
  });

  $('#go-to-register').on('click', (e) => {
    e.preventDefault();
    $('#register').show();
    $('#login').hide();
  });

  $('#register-form').on('submit', (e) => {
    e.preventDefault();
    register();
  });

  $('#go-to-login').on('click', (e) => {
    e.preventDefault();
    $('#register').hide();
    $('#login').show();
  });

  $('#logout-btn').on('click', (e) => {
    e.preventDefault();
    logout();
  });

  $('#todo-form').on('submit', (e) => {
    e.preventDefault();
    addTodo();
  });

  $('#edit-cancel-btn').on('click', (e) => {
    e.preventDefault();
    $('#todos').show();
    $('#edit-todo').hide();
  })

  $('#edit-todo').on('submit', (e) => {
    e.preventDefault();
    edit();
  })
});

const isLoggedIn = () => {
  if(localStorage.getItem('access_token')) {
    $('#login').hide();
    $('#register').hide();
    $('#nav-bar').show();
    $('#todos').show();
    getTodos();
    $('#edit-todo').hide();
  }
  else {
    $('#login').show();
    $('#register').hide();
    $('#nav-bar').hide();
    $('#todos').hide();
    $('#edit-todo').hide();
  };
};

const login = () => {
  const email = $('#email-login').val();
  const password = $('#password-login').val();

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
    $('#email-login').val('');
    $('#password-login').val('');
  })
  .fail(err => {
    const { errors } = err.responseJSON;
    console.log(errors);
  })
  .always(() => {
    isLoggedIn();
  });
};

const register = () => {
  const email = $('#email-register').val();
  const password = $('#password-register').val();

  $.ajax({
    method: 'POST',
    url: 'http://localhost:3000/users/register',
    data: {
      email,
      password
    }
  })
  .done(() => {
    $('#email-register').val('');
    $('#password-register').val('');

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
      status: 'todo'
    }
  })
  .done(() => {
    getTodos();
    $('#title').val('');
    $('#description').val('');
    $('#due-date').val('');
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
    $('#todo-list').empty();
    data.data.forEach(todo => {
      let due_date = new Date(todo.due_date).toISOString().split('T')[0]

      if(todo.status === 'done') {
        $('#todo-list').append(`
        <ul style="background: lightgreen; padding: 10px; border-radius: 10px; box-shadow: 0px 0px 10px 0px #bababa; list-style: none;">
          <li>
            <div>
              <small class="font-weight-bold">Todo ${todo.id}</small>
              <p style="text-decoration: line-through; color: lightslategray">
                Title: ${todo.title} <br>
                Description: ${todo.description} <br>
                Due Date: ${due_date}
              </p>
            </div>
            <div class="d-flex justify-content-end">
              <a onclick="deleteTodo(${todo.id})"><i class="fas fa-trash" style="color: rgb(255, 113, 113); cursor: pointer;"></i></a>
            <div>
          </li>
        </ul>
        `)
      }
      else if(todo.status === 'todo') {
        $('#todo-list').append(`
        <ul style="background: #fff; padding: 10px; border-radius: 10px; box-shadow: 0px 0px 10px 0px #bababa; list-style: none;">
          <li>
            <div>
              <small class="font-weight-bold">Todo ${todo.id}</small>
              <p>
                Title: ${todo.title} <br>
                Description: ${todo.description} <br>
                Due Date: ${due_date}
              </p>
            </div>
            <div class="d-flex justify-content-end">
              <a onclick="deleteTodo(${todo.id})"><i class="fas fa-trash" style="color: rgb(255, 113, 113); cursor: pointer;"></i></a>
              <a onclick="editStatusTodo(${todo.id})"><i class="fas fa-check" style="color: rgb(44, 196, 44); cursor: pointer; margin-left: 10px;"></i></a>
              <a onclick="editTodo(${todo.id})"><i class="fas fa-edit" style="color: rgb(98, 169, 255); cursor: pointer; margin-left: 10px;"></i></a>
            <div>
          </li>
        </ul>
      `)
      }
    });
  })
  .fail(err => {
    const { errors } = err.responseJSON;
    console.log(errors);
  })
  .always();
}

const deleteTodo = (id) => {
  $.ajax({
    method: 'DELETE',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
  .done((_) => {
    getTodos();
  })
  .fail(err => {
    const { errors } = err.responseJSON;
    console.log(errors);
  })
  .always();
};

const editStatusTodo = (id) => {
  $.ajax({
    method: 'PATCH',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token')
    },
    data: {
      status: 'done'
    }
  })
  .done((_) => {
    getTodos();
  })
  .fail(err => {
    const { errors } = err.responseJSON;
    console.log(errors);
  })
  .always();
};

const editTodo = (id) => {
  $.ajax({
    method: 'GET',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token')
    }
  })
  .done(({data}) => {
    localStorage.setItem('todo-id', id);
    $('#edit-title').val(data.title);
    $('#edit-description').val(data.description);
    $('#edit-due-date').val(data.due_date);
    console.log(data.due_date);
    $('#edit-todo').show();
    $('#todos').hide();
  })
  .fail(err => {
    const { errors } = err.responseJSON;
    console.log(errors);
  })
  .always();
};

const edit = () => {
  const id = localStorage.getItem('todo-id');
  const title = $('#edit-title').val();
  const description = $('#edit-description').val();
  const due_date = $('#edit-due-date').val();

  $.ajax({
    method: 'PUT',
    url: `http://localhost:3000/todos/${id}`,
    headers: {
      access_token: localStorage.getItem('access_token')
    },
    data: {
      title,
      description,
      due_date
    }
  })
  .done(() => {
    getTodos();
    $('#edit-todo').hide();
    $('#todos').show();
  })
  .fail(err => {
    const { errors } = err.responseJSON;
    console.log(errors);
  })
  .always()
}