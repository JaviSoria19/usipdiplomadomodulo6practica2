const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");

const app = jsonServer.create();
const router = jsonServer.router("db.json");

const middlewares = jsonServer.defaults();
app.db = router.db;

const rules = auth.rewriter({
  users: 660,
  cursos: 640,
  colegios: 640,
  profesores: 640,
  estudiantes: 640,
  asignaturas: 640,
  calificaciones: 640
});

app.use(cors());
app.use(middlewares);
app.use(rules);
app.use(auth);
app.use(router);

app.listen(3000, () => {
  console.log("🚀 JSON Server corriendo en http://localhost:3000");
});
