const router = require('express').Router();
const {Host} = require('../../models');
const bcrypt = require('bcrypt');
// configure objects to use with conditional rendering
function redirectUser(req, res, next){
    if (req.session.user){
        res.redirect('/home');
    } else{
        res.redirect('/signin');
    }
    next();
}
const loginRenderOptions={
        auth:{
            login:{
                header: "Sign In",
                subheader: "Welcome Back"
            },
            method:{
                type: "Sign In",
                opposite: "Sign Up",
                oppositeRoute: "/signup"
            },
            formAction: "/signin"
        }
    },
    signUpRenderOptions={
        auth:{
            signup:{
                header: "Sign Up",
                subheader: "Welcome"
            },
            method:{
                type: "Sign Up",
                opposite: "Sign In",
                oppositeRoute: "/signin"
            },
            formAction:"/signup"
        }
    };

router.get('/',(req, res)=>{
        res.render('partials/homepage');
});

router.get('/signin',(req, res)=>{
    res.render('partials/auth', loginRenderOptions);
});
router.post("/signin",(req, res)=>{
    Host.findOne({
        where: {
            username: req.body.username
        }
    }).then((hostData) => {
        if(!hostData){
            res.status(400)
        }
        if (hostData.checkPassword(req.body.password)) {
            req.session.user = hostData.username;
            // res.locals.user = req.session.user;
            // res.redirect('/home');
        }
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    })
});


router.get('/signup', (req, res)=>{
    // if (req.session.user){
    //     res.redirect('/home')
    // } else {
        res.render('./partials/auth', signUpRenderOptions);
    // }
});
router.post("/signup",async(req, res)=>{
    const signupBody = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };
    Host.create(signupBody)
        .then((dbHostData) =>{
            req.session.user = dbHostData.username;
            //res.locals.user = req.session.user;
            res.redirect('/home');
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});
module.exports = router;