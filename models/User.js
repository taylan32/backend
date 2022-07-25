const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide a email"],
      unique: [true, "E-mail already in use."],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must contain 8 or more characters."],
      select: false,
    },
    firstName: {
      type: String,
      required: [true, "Please provide a name"],
      minlength: [2, "Name must contain at least 2 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name"],
      minlength: [2, "Last name must contain at least 2 characters"],
    },
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        select: false,
      },
    ],
    products:[
      {
       type:mongoose.Types.ObjectId,
       ref:"Product",
       select:false 
      }
    ],
    isAdmin:{
      type:Boolean,
      required:[true, "Role missing"],
      default:false
    },
    profileImage: {
      type: String,
      default: "default.jpg",
    },
  },
  { timestamps: true }
);

UserSchema.methods.generateJWT = function () {
  const { SECRET_KEY, TOKEN_EXPIRATION } = process.env;
  const payload = {
    id: this._id,
    email:this.email,
    firstName: this.firstName,
    lastName: this.lastName,
  };

  const token = jwt.sign(payload, SECRET_KEY, {
    expiresIn: TOKEN_EXPIRATION,
  });
  return token;
};

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) next(err);
      bcrypt.hash(this.password, salt, (err, hash) => {
        if (err) next(err);
        this.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

module.exports = mongoose.model("User", UserSchema);
