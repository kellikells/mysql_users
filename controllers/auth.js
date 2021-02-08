const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});



exports.register = (req, res) => {

    // const username = req.body.username;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirm = req.body.passwordConfirm;

    // destructuring
    const { username, email, password, passwordConfirm } = req.body;

    // async function 
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already registered'
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        // async , await
        // hash password 8 times
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { username: username, email: email, password: hashedPassword }, (error, results) => {
            if(error){
                console.log(error);
            } else {
                console.log(results);
                return res.render('register', {
                    message: 'user registered!'
                });
            }
        })
    });
}


exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password ) {
            return res.status(400).render('login', {
                message: 'Please provide email and password'
            });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {

            // if there are no results for the email, or the password does not match 
            if ( !results || !(await bcrypt.compare(password, results[0].password))) {

                // status 401 - forbidden
                res.status(401).render('login', {
                    message: 'Email or password is incorrect'
                })
            } else {
                const id = results[0].id;

                // set up token to set in cookies
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log(`the token is ${token}`);

                // set up cookies 
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                // putting the cookie in the browser 
                res.cookie('jwt', token, cookieOptions );
                res.status(200).redirect('/');
            }
        })

    }catch (error) {
        console.log(error);
    }
}