const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
<<<<<<< HEAD
    username: {
    type: String,
    required: true, // Make this field required or optional based on your needs
=======
  username: {
    type: String,
    required: true,
>>>>>>> 125050b5 (Fix registration route and API URL)
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

<<<<<<< HEAD
// Add method to compare passwords
=======
// Compare method
>>>>>>> 125050b5 (Fix registration route and API URL)
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (err) {
    throw new Error('Error comparing password');
  }
};

<<<<<<< HEAD
// Pre-save middleware to hash password if modified
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create User model
=======
>>>>>>> 125050b5 (Fix registration route and API URL)
const User = mongoose.model('User', userSchema);
module.exports = User;
