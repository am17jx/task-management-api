const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A user must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A user name must have less or equal than 40 characters'],
        minlength: [3, 'A user name must have more or equal than 10 characters'],
    },
    email: {
        type: String,
        required: [true, 'A user must have an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
        
    },
    password: {
        type: String,
        required: [true, 'A user must have a password'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        select: false,
        validate: {
            validator: function(el) {
                // This only works on SAVE and CREATE operations
                return el === this.password;
            },
            message: 'Passwords are not the same'
        }
    },
    role :{
        type:String,
        enum:["admin","user"],
        default:"user",
        required: [false]



    },
    passwordChangedAt: Date,
    passwordResetToken:String,
    passwordResetExpires: Date,
    active: {
        type:Boolean,
        default:true,
        select: false, // This will hide the field from the response


    }   
});


userSchema.pre(/^find/,function(next) {

    this.find({active:{$ne:false}});
    next();
    
})

userSchema.methods.correctPassword = async function(candidatePassword) {
    // 'this' refers to the current document (user)
    return await bcrypt.compare(candidatePassword, this.password);
};


userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;




    }
    return false;
}


// ...

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
  
    this.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  
    console.log({ resetToken }, this.passwordResetToken);
  
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
    return resetToken;
  };
  
  userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  });

const User = mongoose.model('User', userSchema);

module.exports = User;