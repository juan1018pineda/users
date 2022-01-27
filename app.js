import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.urlencoded());

//Conexión a DB
mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/users", {
  useNewUrlParser: true,
});
mongoose.connection.on("error", function (e) {
  console.error(e);
});

//Schema
const schema = {
  name: String,
  email: String,
  password: String,
};

//Model
const User = mongoose.model("users", schema);

//Controler
app.get("/register", (req, res) => {
  res.send(
    `<form method='POST' action='/register'>
          <label for="name">Nombre
          <input type='text'name="name" id="name" />
          </label>
          <label for="email">Email
          <input type='email'name="email" id="email" />
          </label>
          <label for="password">Contraseña
          <input type='password'name="password" id="password"/>
          </label>
          <button type='submit'>Registrarse</button>
      </form>`
  );
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const newUser = { name, email, password };
  const user = new User(newUser);
  user.save((err, user) => {
    if (err) res.sendStatus(500);
    res.redirect('/');
  });
});

app.get("/", async (req, res) => {
  const users = await User.find();
  let html = `<a href="/register">Registrarse</a><table><thead><tr><th>Name</th><th>Email</th></tr></thead><tbody>`;
  users.forEach((user) => {
    html += `<tr><td>${user.name}</td><td>${user.email}</td></tr>`;
  });
  html += `</tbody></table>`;
  res.send(html);
});

app.listen(3000, () => console.log("Listening on port 3000"));
