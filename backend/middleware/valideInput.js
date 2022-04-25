const Joi = require('@hapi/joi');

// Contrôle des données lorsqu'un utilisateur souhaite créer un compte
const userSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(1).required()
});
exports.userData = (req, res, next) => {
    const { error, value } = userSchema.validate(req.body);
    if (error) {
        res.status(422).json({ error: "email ou mot de passe invalide" });
    } else {
        next();
    }
};
// Contrôle des données lorsqu'un utilisateur souhaite modifier ou supprimer une sauce
const sauceSchema = Joi.object({
    userId: Joi.string().trim().required(),
    name: Joi.string().trim().min(1).required(),
    manufacturer: Joi.string().trim().min(1).required(),
    description: Joi.string().trim().min(1).required(),
    mainPepper: Joi.string().trim().min(1).required(),
    heat: Joi.number().integer().min(1).max(10).required(),
});

exports.sauceData = (req, res, next) => {
    if (req.file) {
        sauce = JSON.parse(req.body.sauce);
    } else {
        sauce = req.body;
    }
    const { error, value } = sauceSchema.validate(sauce);
    if (error) {
        res.status(401).json({ error: "Les données ne sont pas valides" });
    } else {
        next();
    }
}