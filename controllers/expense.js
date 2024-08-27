const expenseDb = require("../models/expense");
const userDb = require("../models/user");
const { verifyToken } = require("../services/auth");
async function addExpense(req, res) {
  try {
     const token = req.cookies.auth_token;
     if (!token) {
       return res
         .status(401)
         .json({ success: false, message: "No token provided" });
     }
     const decoded = verifyToken(token);
     if (!decoded) {
       return res.status(401).json({ success: false, message: "unothorized" });
     }
     const profileData = await userDb.findOne({ phone: decoded?.phone });
     if (!profileData) {
       return res.status(401).json({ success: false, message: "unothorized" });
     }
     const profileDataObject = profileData.toObject();
    const {
      friendName,
      friendNumber,
      type,
      amount,
      desc,
    } = req.body;
    console.log({ profileDataObject,body:req.body});
    if(type == 'lent'){
       await expenseDb.create({
         friend1Name : profileDataObject.fullName,
         friend2Name : friendName,
         friend1Phone: profileDataObject.phone,
         friend2Phone:friendNumber,
         amount:amount,
         desc:desc
       });
    }else{
       await expenseDb.create({
         friend1Name: friendName,
         friend2Name: profileDataObject.fullName,
         friend1Phone: friendNumber,
         friend2Phone: profileDataObject.phone,
         amount: amount,
         desc: desc,
       });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false ,message:'in error'});
  }
}

async function getExpense(req, res) {
  try {
    const token = req.cookies.auth_token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }
    const decoded = verifyToken(token);
    if(!decoded){
      return res
        .status(401)
        .json({ success: false, message: "unothorized" });
    }
    const expenses = await expenseDb.find({
      $or: [{ friend1Phone: decoded?.phone }, { friend2Phone: decoded?.phone }],
    });
   res.json({ UserData: expenses });
  } catch (error) {
    res.json({ success: false });
  }
}

async function updateUserById(req, res) {
  try {
     const token = req.cookies.auth_token;
     if (!token) {
       return res
         .status(401)
         .json({ success: false, message: "No token provided" });
     }
     const decoded = verifyToken(token);
     if (!decoded) {
       return res.status(401).json({ success: false, message: "unothorized" });
     }
    const body = req.body;
    const id = req.params.id;
    const result = await expenseDb.findByIdAndUpdate(
      { _id: id },
      { $set: body }
    );
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
}

async function deleteExpense(req, res) {
  try {
     const token = req.cookies.auth_token;
     if (!token) {
       return res
         .status(401)
         .json({ success: false, message: "No token provided" });
     }
     const decoded = verifyToken(token);
     if (!decoded) {
       return res.status(401).json({ success: false, message: "unothorized" });
     }
    const result = await expenseDb.findByIdAndDelete(req.params.id);
    if (!result) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "An error occurred" });
  }
}

module.exports = {
  addExpense,
  getExpense,
  updateUserById,
  deleteExpense,
};
