const express= require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');

//User model

const User = require ('../models/User');

//Login Page
router.get('/login', (req,res)=>
{
    res.render('login');
});

router.get('/register',(req,res)=>
{
    res.render('register');

});

//Register Handle

router.post('/register',(req,res)=>
{
   const {name,email,password, password2}= req.body;

   let errors = [];

   //Check required fields

   if(!name || !email || !password || !password2)
   {
       errors.push({msg: 'Please fill in all fields !'});
   }

   //Check passwords match

   if(password !=password2)
   {
       errors.push({msg : "Passwords do not match"});
   }

   //Check password length

   if(password.length <10)
   {
       errors.push({msg: "Password should atleast be 10 characters"});

   }

   if(errors.length>0)
   {
       res.render('register',{
           errors,
           name,
           email,
           password,
           password2
       });
       
   }
   else{
       //res.send('pass');
       //Validation Passed

       User.findOne({email:email})
       .then(user =>
        {
            if(user)
            {
                //user exist
                errors.push({msg:'Email already registered'});                
       res.render('register',{
        error,
        name,
        email,
        password,
        password2
    });
 }
    else{

        const newUser = new User({
            name,
            email, 
            password
        });

        //hash password

        bcrypt.genSalt(10, (error,salt) =>
        {
            bcrypt.hash(newUser.password,salt, (error,hash)=>
            {
                if(error) throw error;
                //Set password to hash
                newUser.password= hash;
                //Save user
                newUser.save()
                .then(user =>
                    {
                        req.flash('success_msg', 'You are now Registered');
                        res.redirect('/users/login');
                    })
                .catch(error=> console.log(error));
            });

        });


    }
        });


   }
});

module.exports = router;