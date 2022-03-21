const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, min : 0, max : 10, required: true },
    likes: { type: Number, required: true },
    dislikes: { type: Number, required: true },
    usersLiked: { type: Array, default : [], required: true },
    usersDislikes: { type: Array, default : [], required: true },
    
  });

  const userSchemaUtilisateurs = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });


