const Sauce = require('../models/sauce');
const fs = require('fs');

// AFFICHER TOUTES LES SAUCES
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// AFFICHER UNE SEULE SAUCE GRÂCE À SON ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

// CRÉER UNE NOUVELLE SAUCE
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => {
            res.status(400).json({ error });
        });
};

// MODIFIER UNE SAUCE GRÂCE À SON ID
exports.modifySauce = (req, res, next) => {
    if (req.file) {
        // si l'image est modifiée, il faut supprimer l'ancienne image dans le dossier /image
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    // une fois que l'ancienne image est supprimée dans le dossier /image, on peut mettre à jour le reste
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                    }
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
                        .catch(error => res.status(400).json({ error }));
                })
            })
            .catch(error => res.status(500).json({ error }));
    } else {
        // si l'image n'est pas modifiée
        const sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce modifiée!' }))
            .catch(error => res.status(400).json({ error }));
    }
};


// SUPPRIMER UNE SAUCE GRÂCE À SON ID
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

// LIKE / DISLIKE UNE SAUCE GRÂCE À SON ID
exports.likeSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauceId = req.params.id;
    Sauce.findOne({ _id: sauceId })
        .then(sauce => {
            // Nouvelles valeurs à modifier
            const newValues = {
                usersLiked: sauce.usersLiked,
                usersDisliked: sauce.usersDisliked,
                likes: 0,
                dislikes: 0
            }
            // Différents cas:
            switch (like) {
                case 1:  // CAS: sauce liked
                    newValues.usersLiked.push(userId);
                    break;
                case -1:  // CAS: sauce disliked
                    newValues.usersDisliked.push(userId);
                    break;
                case 0:  // CAS: Annulation du like/dislike
                    if (newValues.usersLiked.includes(userId)) {
                        // Si l'utilisateur annule son like
                        const index = newValues.usersLiked.indexOf(userId);
                        newValues.usersLiked.splice(index, 1);
                    } else {
                        // Si l'utilisateur annule son dislike
                        const index = newValues.usersDisliked.indexOf(userId);
                        newValues.usersDisliked.splice(index, 1);
                    }
                    break;
            };
            // On attribut les nouvelles valeurs des likes / dislikes
            newValues.likes = newValues.usersLiked.length;
            newValues.dislikes = newValues.usersDisliked.length;

            // Update de la sauce avec les nouvelles valeurs
            Sauce.updateOne({ _id: sauceId }, newValues)
                .then(() => res.status(200).json({ message: 'Sauce notée !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
}

