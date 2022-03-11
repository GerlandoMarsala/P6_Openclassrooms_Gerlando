

const bcrypt = require('bcrypt');
const User = require('../models/User');

const user = require('../models/User');

// Etape 2 Crééz un compte
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
        
        user.save()
        .then(()=> res.status(201).JSON({message: 'utilisateur créé'}))
        .catch(error => res.status(400).JSON({error}));
    })
    .catch(error => res.status(500).JSON({error}));
};

exports.login = (req, res, next) => {
// Etape 2 Se connecter
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: 'TOKEN'
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
};