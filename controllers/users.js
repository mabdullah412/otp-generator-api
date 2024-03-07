const moment = require("moment");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const firebaseConfig = {
  credential: cert({
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URL,
    token_uri: process.env.TOKEN_URL,
    auth_provider_x509_cert_url: process.env.AUTH_PRIOVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  }),
};

// initialize firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = {
  get: async (req, res) => {
    try {
      const response = await db.collection("users").get();
      const userData = response.docs.map((doc) => {
        let data = doc.data();
        if (data["otp_expiration_date"]) {
          data["otp_expiration_date"] = data["otp_expiration_date"].toDate();
        }
        data["id"] = doc.id;
        return data;
      });

      return res.status(200).json({
        users: userData,
      });
    } catch (err) {
      console.error("Error getting users: ", err);
      return res.status(400).json({ message: "Oops! couldn't get users" });
    }
  },

  generateOTP: async (req, res) => {
    try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
        return res.status(400).json({ message: "No phoneNumber provided" });
      }

      // check if user exists in db
      const getUserId = await db
        .collection("users")
        .where("phoneNumber", "==", phoneNumber)
        .get();
      let userId = "";

      // if exists, get id else send err msg
      if (getUserId.empty) {
        return res
          .status(400)
          .json({ message: "Provided phoneNumber is not signed up" });
      } else {
        userId = getUserId.docs[0].id;
      }

      // generate random 4 digit OTP
      let min = 1000;
      let max = 9999;
      let otp = Math.floor(Math.random() * (max - min + 1) + min);

      // add 5 minutes to current date
      const otp_expiration_date = moment(new Date()).add(5, "minutes").toDate();

      const response = await db.collection("users").doc(userId).set(
        {
          otp: otp,
          otp_expiration_date: otp_expiration_date,
        },
        { merge: true }
      );

      return res.status(200).json({
        id: userId,
        message: "OTP generated successfully",
      });
    } catch (err) {
      console.error("Error generating OTP: ", err);
      return res.status(400).json({ message: "Oops! couldn't generate OTP" });
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const { otp } = req.query;
      const { user_id } = req.params;

      // check if user exists in db
      const checkUser = await db.collection("users").doc(user_id).get();
      let user = "";

      if (!checkUser.exists) {
        return res
          .status(400)
          .json({ message: "User with this id does not exist" });
      } else {
        user = checkUser.data();
      }

      // check if OTP was generated or not
      if (!user["otp_expiration_date"]) {
        return res.status(400).json({ message: "OTP was not generated" });
      }

      // check if OTP matches or not
      if (otp != user["otp"]) {
        return res.status(400).json({ message: "Entered OTP is invalid" });
      }

      // if OTP matches, check for expiry
      let currentTime = new Date();
      let otp_expiration_date = user["otp_expiration_date"].toDate();

      if (currentTime > otp_expiration_date) {
        return res.status(400).json({ message: "Entered OTP is expired" });
      }

      return res.status(200).json({ message: "OTP approved" });
    } catch (err) {
      console.error("Error verifying OTP: ", err);
      return res.status(200).json({ message: "Oops! couldn't verify OTP" });
    }
  },

  create: async (req, res) => {
    try {
      const { firstName, phoneNumber } = req.body;

      if (!firstName) {
        return res.status(400).json({ message: "No firstName provided" });
      }
      if (!phoneNumber) {
        return res.status(400).json({ message: "No phoneNumber provided" });
      }

      // check if phoneNumber already exists in db
      const checkPhone = await db
        .collection("users")
        .where("phoneNumber", "==", phoneNumber)
        .get();
      if (!checkPhone.empty) {
        return res
          .status(400)
          .json({ message: "Provided phoneNumber is already signed up" });
      }

      const data = {
        firstName: firstName,
        phoneNumber,
        phoneNumber,
      };

      const response = await db.collection("users").add(data);

      return res.status(200).json({
        id: response.id,
        message: "User created successfully",
      });
    } catch (err) {
      console.error("Error creating user: ", err);
      return res.status(200).json({ message: "Oops! couldn't create a User" });
    }
  },

  remove: async (req, res) => {
    try {
      const { user_id } = req.params;
      const response = await db.collection("users").doc(user_id).delete();
      return res.status(200).json({ message: "User removed successfully!" });
    } catch (err) {
      console.error("Error while deleting User from db: ", err);
      return res.status(200).json({ message: "Couldn't delete User" });
    }
  },

  update: async (req, res) => {
    try {
      const { user_id } = req.params;
      const { firstName } = req.body;

      const response = await db.collection("users").doc(user_id).set(
        {
          firstName: firstName,
        },
        { merge: true }
      );

      return res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
      console.error("Error while updating User: ", err);
      return res.status(200).json({ message: "Couldn't update user" });
    }
  },
};
