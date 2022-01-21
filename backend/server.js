const express = require('express');
const cookieParser = require('cookie-parser');
const nedb = require('nedb-promise');
const app = express();
const database = new nedb({
  filename: 'accounts.db',
  autoload: true
});
app.use(express.static('../frontend'));
app.use(express.json());
app.use(cookieParser());


async function admin(request, response, next) {
  const cookie = request.cookies.loggedIn;
  console.log(cookie);

  try {
    console.log("i try")
    const account = await database.find({
      cookie: parseInt(cookie)
    });

    console.log(account);

    if (account.length == 0) {
      throw new Error();
    } else if (account[0].role == "admin") {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    console.log("i catch");

    const resObj = {
      success: false,
      errorMassage: 'unautherized'
    }

    response.send(resObj);
  }

}


app.post('/api/signup', async (request, response) => {
  const credentials = request.body;
  const resObj = {
    success: true,
    usernameExists: false,
    emailExists: false
  }
  const usernameExists = await database.find({
    username: credentials.username
  });
  const emailExists = await database.find({
    email: credentials.email
  });

  if (usernameExists.length > 0) {
    resObj.usernameExists = true;
  }
  if (emailExists.length > 0) {
    resObj.emailExists = true;
  }
  if (resObj.usernameExists == true || resObj.emailExists == true) {
    resObj.success = false;
  } else {
    if (credentials.username == 'admin') {
      credentials.role = 'admin'
    } else {
      credentials.role = 'user';
    }
    database.insert(credentials);
    console.log(credentials);
  }
  response.json(resObj);
});

app.post('/api/login', async (request, response) => {
  const credentials = request.body;
  const resObj = {
    success: false
  };

  const account = await database.find({
    username: credentials.username
  });

  if (account.length > 0) {
    if (account[0].password == credentials.password) {
      resObj.success = true;

      const cookieId = Math.round(Math.random() * 10000);

      database.update({
        username: credentials.username
      }, {
        $set: {
          cookie: cookieId
        }
      });

      response.cookie("loggedIn", cookieId);
    }
  }

  response.json(resObj);
});

app.get("/api/loggedin", async (request, response) => {
  const cookie = request.cookies.loggedIn;

  let resObj = {
    loggedIn: false
  }
  const account = await database.find({
    cookie: parseInt(cookie)
  });

  if (account.length > 0) {
    resObj.loggedIn = true;
  };

  response.json(resObj);
});

app.get("/api/account", async (request, response) => {
  const cookie = request.cookies.loggedIn;

  let resObj = {
    email: '',
    role: ''
  }
  const account = await database.find({
    cookie: parseInt(cookie)
  });
  if (account.length > 0) {
    resObj.email = account[0].email;
    resObj.role = account[0].role;
  }

  response.json(resObj);
});

app.get("/api/logout", (request, response) => {
  response.clearCookie("loggedIn");
  response.end();
});

app.get("/api/delete", (request, response) => {
  const cookie = request.cookies.loggedIn;

  database.remove({
    cookie: parseInt(cookie)
  });

  response.clearCookie("loggedIn");
  response.end();
});

app.get("/api/user-account", admin, async (request, response) => {
  const resObj = {
    success: false,
    accounts: ''
  }
  const userAccounts = await database.find({
    role: 'user'
  }, {
    multi: true
  });
  if (userAccounts.length > 0) {
    resObj.success = true;
    resObj.accounts = userAccounts;
  }
  response.json(resObj);
});

app.post("/api/change-password", admin, async (request, response) => {
  const newPassword = request.body
  const cookie = request.cookies.loggedIn;
  const account = await database.find({
    cookie: parseInt(cookie)
  });
  const resObj = {
    success: false,
  }

  console.log(newPassword);
  database.update({ cookie: parseInt(cookie) }, { $set: { password: newPassword.password } });
  response.json(resObj);
});

app.listen(3000, () => {
  console.log('server listening on port 3000');
});
