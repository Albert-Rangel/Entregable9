import passport from "passport";
import local from "passport-local";
import githubStrategy from "passport-github2"
import { userModel } from '../dao/models/user.model.js';
import bcrypt from 'bcrypt';



const localStrategy = local.Strategy;

const initiaizePassport = () => {
    passport.use(
        'register',
        new localStrategy(
            { passReqToCallback: true, usernameField: 'email' },
            async (req, username, password, done) => {
                console.log(req.body)
                const { firstname, lastname, email, age } = req.body;
                if (email == "adminCoder@coder.com") {
                    return done(null, false)
                } else {
                    const userExists = await userModel.findOne({ email })

                    if (userExists) {
                        return done(null, false)
                    }

                    const user = await userModel.create({
                        firstname,
                        lastname,
                        email,
                        age,
                        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                    });
                    return done(null, user)
                }
            }));

    passport.use(
        'login',
        new localStrategy(
            { usernameField: 'email' },
            async (username, password, done) => {
                try {
                    if (username == "adminCoder@coder.com" && password == "adminCod3r123") {
                        const adminuser = {
                            firstname: "Usuario",
                            lastname: "Administrador",
                            age: "20",
                            email: email,
                            admin: true,
                        }
                        return done(null, adminuser);
                    }

                    const user = await userModel.findOne({ email: username }).lean();

                    if (!user) {
                        return done(null, false);
                    }

                    if (!bcrypt.compareSync(password, user.password)) {
                        // console.log("no es la CONTRASE;A")
                        return done(null, false);
                    }
                    console.log("SI es la CONTRASE;A")
                    console.log(user)
                    return done(null, user);

                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.use("github", new githubStrategy(
        {
            clientID: 'Iv1.abfb4e2fbb512adf',
            clientSecret: '5cebb1e4cedf69bf9dfbab76082420b4d62d0b17',
            callbackURL: 'http://localhost:8080/api/githubcallback',
            scope: ['user:email'],
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                const fullname = profile._json.name;
                const words = fullname.split(' ');
                const email = profile.emails[0].value;
                const user = await userModel.findOne({ email });
                if (!user) {
                    const newUser = await userModel.create({
                        firstname: words[0],
                        lastname: words[1],
                        age: 18,    
                        password: '',
                        email,
                    });

                    done(null, newUser);
                } else {
                    done(null, user);
                }
            } catch (error) {
                done(error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        console.log("serializo el usuario")
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        console.log("serdeserializo  el usuario")

        const user = await userModel.findById(id);
        console.log(user)
        done(null, user);
    });
}

export default initiaizePassport