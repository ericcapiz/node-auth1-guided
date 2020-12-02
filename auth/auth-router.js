const router = require('express').Router();
const users = require('../users/users-model');
const bcrypt = require('bcryptjs'); //npm i bcryptjs

router.post('/register', async (req,res)=>{
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 10);
    user.password = hash;
    try{
        const saved = await users.add(user);
        res.status(201).json(saved)
    } catch (err){
        console.log(err);
        res.status(500).json(err);
    }
})

router.post('/login',async (req, res)=>{
    let {username, password} = req.body;

    try{
        const user = await users.findBy({username}).first();
        if(user && bcrypt.compareSync(password, user.password)){
            res.status(200).json({message: `welcome ${user.username}`})
        } else{
            res.status(401).json({message: 'invalid creds'})
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
})


module.exports = router;