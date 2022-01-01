const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const config = require("../config");
const transporter = require("../utils/nodeMail");
const fs = require("fs");
// const { use } = require("../utils/nodeMail");
require("dotenv").config();

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.sendStatus(500);
  }
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id); 

    res.send(user);
  } catch (error) {
    res.sendStatus(500);
  }
};

const getMyProfile = async (req, res) => {
  res.send({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    age: req.user.age,
    isAdmin: req.user.isAdmin,
    profile: req.user.profile,
  });
};

const userSignUp = async (req, res) => {
  const { name, email, password, age, isAdmin } = req.body;
  try {
    const hashPw = await bcrypt.hash(password, 8);
    const user = new User({
      name,
      email,
      password: hashPw,
      age,
      isAdmin,
      profile: req.file.path,
    });
    const token = await generateToken(user);
  
    await user.save();

    const mailOptions = {
      from: config.MAIL_USER,
      to: user.email,
      subject: "Thanks for creating account",
      text: `Hey ${user.name}. Thank you so much for using our service. `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return;
      }

      console.log(`Email sent successfully to ${user.email}`);
    });

    res.send({
      _id: user.id,
      name: user.name,
      email: user.email,
      age: user.age,
      isAdmin: user.address,
      profile: user.profile,
      token,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const userSignIn = async (req, res) => {

  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const samePw = await bcrypt.compare(String(req.body.password), user.password);
      if (samePw) {
        const token = await generateToken(user);

        res.send({
          _id: user.id,
          name: user.name,
          email: user.email,
          age: user.age,
          isAdmin: user.isAdmin,
          profile: user.profile,
          token,
        });
      } else {
        res.status(401).send("Wrong Email and Password");
      }
    } else {
      res.status(401).send("Wrong Email and Password");
    }
  } catch (error) {
    res.sendStatus(500);
  }
};

const userSignOut = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((data) => {
      return data.token !== req.token;
    });

    await req.user.save();
    res.send("Logout finished");
  } catch (error) {
    res.sendStatus(500);
  }
};

const changePassword = async( req, res)=>{
  try{
    const user = await User.findById(req.user._id);
    const samePw = await bcrypt.compare(String(req.body.prevPw), user.password);

    if(!samePw){
      res.status(400).send("Your Previous Password is wrong ");
      return;
    }

    const hashPw = await bcrypt.hash(req.body.newPw, 8);    
    const updateData = {
      name: user.name,
      email: user.email,
      age: user.age,
      isAdmin: user.isAdmin,
      profile: user.profile,
      tokens: user.tokens,
      password: hashPw

    }

    const updateUser = await User.findByIdAndUpdate(req.user._id, updateData, {new: true});

    res.send({      _id: updateUser.id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin:updateUser.isAdmin,
      age: updateUser.age,
      isAdmin: updateUser.isAdmin,
      profile: updateUser.profile
    })
  } catch(error){
    res.sendStatus(500);
  }
}

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    req.body.profile = req.file ? req.file.path : user.profile;

    if(req.file){
      fs.unlinkSync(user.profile);
    }

    const updateData = {
      name: user.name,
      email: user.email,
      age: user.age,
      isAdmin: user.isAdmin,
      profile: user.profile,
      tokens: user.tokens,
      password: hashPw
    };

    const updateUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    });
    res.status(200).send({
      _id: updateUser.id,
      name: updateUser.name,
      email: updateUser.email,
      isAdmin:updateUser.isAdmin,
      age: updateUser.age,
      address: updateUser.address,
      profile: updateUser.profile
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    fs.unlinkSync(user.profile);

    await user.remove();

    res.send(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  getMyProfile,
  userSignUp,
  userSignIn,
  userSignOut,
  changePassword,
  updateUser,
  deleteUser,
};
