import { Router } from 'express';
import { userModel } from '../dao/models/user.model.js';
import publicRoutes from "../dao/middlewares/publicRoutes.js"

const router = Router();

router.post('/login', publicRoutes, async (req, res) => {
  console.log("ENTRO EN EL USERROUTER")
  const { email, password } = req.body;

  if (email == "adminCoder@coder.com" && password == "adminCod3r123") {
    req.session.firstname = "Usuario";
    req.session.lastname = "Administrador";
    req.session.age = "20";
    req.session.email = email;
    req.session.admin = true;

  } else {
    const user = await userModel.findOne({ email, password }).lean();
    console.log(user)

    if (!user) {
      console.log("ENTRO ENdonde no encontro a usuarop con ese email ty contrase")

      return res.redirect('/login');
    }
    req.session.firstname = user.firstname;
    req.session.lastname = user.lastname;
    req.session.age = user.age;
    req.session.email = user.email;
    req.session.admin = false;
  }

  req.session.isLogged = true;

  res.redirect('/products');

});

router.post('/signup', publicRoutes, async (req, res) => {

  const { firstname, lastname, email, age, password } = req.body;

  if (email == "adminCoder@coder.com") {
    return res.send("No puedes registrar a este usuario administrador")
    // console.log("entro en el email de administrador")
    // res.redirect('/error')
  } else {
    const userExists = await userModel.findOne({ email })

    if (userExists) {
      return res.send("Ya estas registrado")
    }

    const user = await userModel.create({ firstname, lastname, email, age, password });
    req.session.firstname = firstname;
    req.session.lastname = lastname;
    req.session.age = age;
    req.session.email = email;
    req.session.admin = false;
  }

  req.session.isLogged = true;

  res.redirect('/products');
});

export default router;