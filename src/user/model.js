import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// Define the model
const userSchema = new mongoose.Schema({
    name: {
        first: {
          type: String,
          validate: {
            validator: function (name) {
              return name.length > 2;
            },
            message: 'Name must be longer than 2 characters.'
          },
          required: [true, 'first name is required.']
        },
        last: {
          type: String,
          validate: {
            validator: function (name) {
              return name.length > 2;
            },
            message: 'Name must be longer than 2 characters.'
          }
        }
    },
    venmoId: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: [
            true, 'Email is required.'
        ],
        lowercase: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    password: String,
    phone: {
        number: {
            type: String
        },
        verified: {
            type: Boolean,
            default: false
        }
    },
    avatar: String
}, {
    timestamps: true
})

userSchema.pre('save', function (next){
    const user = this;
    bcrypt.genSalt(10, (error, salt) => {
        if (error) return next(error);
        bcrypt.hash(user.password, salt, null, (err, crypt) => {
            if (err) return next(err);
            user.password = crypt;
            next();
        })
    })
})

// Make use of methods for comparedPassword
userSchema.methods.comparedPassword = function(p, cb){
    bcrypt.compare(p, this.password, (err, good) => {
        err?cb(err):cb(null, good);
    })
}

// Export the model
export default mongoose.model('User', userSchema);