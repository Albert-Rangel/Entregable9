import { Router } from 'express';
import bcrypt from 'bcrypt';
import { userModel } from '../dao/models/user.model.js';
import publicRoutes from "../dao/middlewares/publicRoutes.js"
import passport  from 'passport';
import privateRoutes from '../dao/middlewares/privateRoutes.js';

const router = Router();

router.post(
  '/login', publicRoutes,
  passport.authenticate('login', { failureRedirect: '/failogin' }),
  async (req, res) => {
    console.log("entro en el userrouter despues de llamar al pasport")
    // console.log(req.user)
    if (!req.user) {
      res.status(400).send();
    }

    if (req.user.first_name == "adminCoder@coder.com" && req.user.lastname == "Administrador") {
      req.session.user = {
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        email: req.user.email,
        age: req.user.age,
        admin: true
      };
    } else {
      req.session.user = {
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        email: req.user.email,
        age: req.user.age,
        admin: false
      };
    }
    req.session.isLogged = true;
    console.log("todo chevere ac ontinaucion la session del usuario")
    console.log(req.session.user)
    // const { email, password } = req.body;

    // if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
    //   // req.session.firstname = "Usuario";
    //   // req.session.lastname = "Administrador";
    //   // req.session.age = "20";
    //   // req.session.email = email;
    //   // req.session.admin = true;

    // } else {
    //   const user = await userModel.findOne({ email });

    //   if (!user) {
    //     // return res.redirect('/login');
    //     return res.send("el correo o contraseña ingresados no corresponde con nuestros registros");
    //   }

    //   if (!bcrypt.compareSync(password, user.password)) {
    //     // return res.redirect('/login');
    //     return res.send("el correo o contraseña ingresados no corresponde con nuestros registros");
    //   }

    //   // req.session.firstname = user.firstname;
    //   // req.session.lastname = user.lastname;
    //   // req.session.age = user.age;
    //   // req.session.email = user.email;
    //   // req.session.admin = false;
    // }
    // req.session.id = user.id;
    // req.session.isLogged = true;

    res.redirect('/products');
  }
);

router.post('/signup', publicRoutes, passport.authenticate("register",
  { failureRedirect: "failsignup" }),
  async (req, res) => {

    //const { firstname, lastname, email, age, password } = req.body;

    // if (email == "adminCoder@coder.com") {
    //   return res.send("No puedes registrar a este usuario administrador")
    // } else {
    //   const userExists = await userModel.findOne({ email })

    //   if (userExists) {
    //     return res.send("Ya estas registrado")
    //   }

    //   const user = await userModel.create({
    //     firstname,
    //     lastname,
    //     email,
    //     age,
    //     password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    //   });

    //   req.session.firstname = firstname;
    //   req.session.lastname = lastname;
    //   req.session.age = age;
    //   req.session.email = email;
    //   req.session.admin = false;
    // }

    // req.session.isLogged = true;

    res.redirect('/login');
  });

router.post('/recover', publicRoutes, async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).lean();

  if (!user) {
    return res.send(
      'Si tu correo existe en nuestros registros, recibiras un mail con la información para recuperar tu contraseña'
    );
  }

  user.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  await userModel.updateOne({ email }, user);

  res.redirect('/login');
});

router.get("/github", 
passport.authenticate("github", {scope: ["user:email"]}))

router.get("/githubcallback", 
passport.authenticate("github",  { failureRedirect: "/login" }),
 (req, res) => {
  req.session.user = {
    firstname: req.user.firstname,
    lastname: req.user.lastname,
    email: req.user.email,
    age: req.user.age,
    admin: false
  };
  req.session.isLogged = true;

  res.redirect("/products")
})

export default router;