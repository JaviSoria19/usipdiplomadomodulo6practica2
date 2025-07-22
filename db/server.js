const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");

const app = jsonServer.create();
const router = jsonServer.router("db.json");

const middlewares = jsonServer.defaults();
app.db = router.db;

const rules = auth.rewriter({
  users: 660,
  cursos: 666,
  colegios: 666,
  profesores: 666,
  estudiantes: 666,
  asignaturas: 666,
  calificaciones: 666
});

app.use(cors());
app.use(middlewares);
app.use(rules);
app.use(auth);
app.use(router);

app.listen(3000, () => {
  console.log("🚀 JSON Server corriendo en http://localhost:3000");
});
