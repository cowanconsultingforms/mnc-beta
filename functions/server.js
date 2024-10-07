const functions = require("firebase-functions");
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });
require("dotenv").config();
const schedule = require("node-schedule");
let emailSent = "false";
let agentEmailSent = "false";

const stripe = require('stripe')(functions.config().stripe.secret); // Stripe secret key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mnc-development-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

const updateNumberOfDaysLeft = async () => {
  try {
    // Step 1: Retrieve all users where role === "vip"
    const snapshot = await db
      .collection("users")
      .where("role", "==", "vip")
      .get();

    // Step 2 and 3: Calculate difference in days and update the numberOfDaysLeft field
    const today = new Date();
    const oneYearLater = new Date(today);
    oneYearLater.setFullYear(today.getFullYear() + 1); // Set the date one year later

    const updatePromises = snapshot.docs.map(async (doc) => {
      const user = doc.data();

      if (user.subscription) {
        const subscriptionDate = user.subscription.toDate();
        // Calculate the date one year later from the subscription timestamp
        const oneYearLater = new Date(subscriptionDate);
        oneYearLater.setFullYear(subscriptionDate.getFullYear() + 1);

        // Calculate the difference in days
        const differenceInDays = Math.ceil(
          (oneYearLater - today) / (1000 * 60 * 60 * 24)
        );

        // If the subscription date is after the calculated oneYearLater date, set numberOfDaysLeft to -1
        const numberOfDaysLeft = differenceInDays >= 0 ? differenceInDays : -1;

        if (
          numberOfDaysLeft < 1 &&
          user?.subscriptionAgentEmailSent === "false"
        ) {
          try {
            // const {  to, message, subject } = req.body;
            const subject = "Subscription expired";
            const text = `The VIP description attached to this account ${user.email} has ended. \n\nThank You\nTeam MNC Development`;
            // Set up email options for each recipient
            const mailOptions = {
              from: process.env.SMTP_FROM,
              to: process.env.SMTP_FROM,
              subject: subject,
              text: text,
            };

            try {
              // Send the email for each recipient
              await transporter.sendMail(mailOptions);
              await db
              .collection("users")
              .doc(doc.id)
              .set(
                {
                  subscriptionEmailSent: "true",
                  subscriptionAgentEmailSent: "true",
                },
                { merge: true }
              );

              if (user.agentEmail.length > 1) {
                const text2 = `The VIP description attached to this account ${user.email} has ended. \n\nThank You\nTeam MNC Development`;
                const mailOptions2 = {
                  from: process.env.SMTP_FROM,
                  to: user.agentEmail,
                  subject: subject,
                  text: text2,
                };
                await transporter.sendMail(mailOptions2);
              }

              console.log(`Email sent successfull`);
            } catch (error) {
              console.error(`Error sending email to:`, error);
            }

            return console.log("Emails sent successfully");
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }
        if (
          numberOfDaysLeft === 7 &&
          user?.subscriptionEmailSent === "false"
        ) {
          try {
            const subject = "Subscription expired";
            const text = `The VIP subscription attached to this account will expire in 7 days. \n\nThank You\nTeam MNC Development`;
            // Set up email options for each recipient
            const mailOptions = {
              from: process.env.SMTP_FROM,
              to: user.email,
              subject: subject,
              text: text,
            };

            await db
              .collection("users")
              .doc(doc.id)
              .set(
                {
                  subscriptionEmailSent: "true",
                  subscriptionAgentEmailSent: "true",
                },
                { merge: true }
              );

            try {
              // Send the email for each recipient
              await transporter.sendMail(mailOptions);
              console.log(`Email sent successfull`);
            } catch (error) {
              console.error(`Error sending email to:`, error);
            }
            return console.log("Emails sent successfully");
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }

        // Add or update the "numberOfDaysLeft" field in the database
        await db
          .collection("users")
          .doc(doc.id)
          .set(
            {
              numberOfDaysLeft: numberOfDaysLeft,
              role: numberOfDaysLeft < 1 ? "user" : "vip",
            },
            { merge: true }
          );
      }
    });

    await Promise.all(updatePromises);

    console.log("Update completed successfully");
  } catch (error) {
    console.error("Error updating numberOfDaysLeft:", error);
  }
};

exports.createPaymentIntent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { amount, currency } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).send({ error: 'Invalid amount' });
      }

      // Create a PaymentIntent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Amount should already be in cents from the frontend
        currency: currency || 'usd',
      });

      res.status(200).send({
        clientSecret: paymentIntent.client_secret,  // Return the client secret to the frontend
      });
    } catch (error) {
      res.status(500).send({
        error: error.message || 'Failed to create payment intent',
      });
    }
  });
});

exports.getPaymentHistory = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).send({
          error: 'Missing userId parameter',
        });
      }

      // Fetch payment history from Firestore collection
      const paymentsRef = db.collection('payments').where('userId', '==', userId);
      const snapshot = await paymentsRef.get();

      if (snapshot.empty) {
        return res.status(404).send({
          error: 'No payment history found for this user',
        });
      }

      // Construct the payment history array from Firestore documents
      const paymentHistory = [];
      snapshot.forEach((doc) => {
        paymentHistory.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Send the payment history back to the client
      return res.status(200).send(paymentHistory);
    } catch (error) {
      return res.status(500).send({
        error: error.message || 'Failed to retrieve payment history',
      });
    }
  });
});

exports.deleteUser = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Assuming the userId is sent in the request body
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).send("User ID is required");
      }

      // Step 1: Delete user from Firebase Authentication
      await admin.auth().deleteUser(userId);

      // Perform the deletion logic here, for example:
      await db.collection("users").doc(userId).delete();

      console.log("User deleted successfully");
      res.status(200).send("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});

// Schedule the function to run every day at a specific time (e.g., midnight)
const scheduledJob = schedule.scheduleJob("0 0 * * *", async () => {
  console.log("Running scheduled job...");
  await updateNumberOfDaysLeft();
});

exports.updateUsersFunction = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("UTC")
  .onRun(async (context) => {
    console.log("Running scheduled update...");
    await updateNumberOfDaysLeft();
    return null;
  });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendEmail = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Extract email details from the request body
      const { recipients, subject, text } = req.body;

      if (!recipients || !subject || !text) {
        return res.status(400).send("Missing required parameters");
      }

      for (const recipient of recipients) {
        // Convert recipient to a comma-separated string
        const to = Array.isArray(recipient) ? recipient.join(", ") : recipient;

        // Set up email options for each recipient
        const mailOptions = {
          from: process.env.SMTP_FROM,
          to,
          subject,
          text,
        };

        try {
          // Send the email for each recipient
          await transporter.sendMail(mailOptions);
          console.log(`Email sent successfully to ${to}`);
        } catch (error) {
          console.error(`Error sending email to ${to}:`, error);
          // Handle the error if needed
        }
      }

      return res.status(200).send("Emails sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});

exports.contactUs = functions.https.onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      // Extract email details from the request body
      const { to, message, subject } = req.body;

      if (!to || !message || !subject) {
        return res.status(400).send("Missing required parameters");
      }

      // Set up email options for each recipient
      const mailOptions = {
        from: process.env.SMTP_FROM,
        to: to,
        subject: subject,
        text: message,
      };

      try {
        // Send the email for each recipient
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfull`);
      } catch (error) {
        console.error(`Error sending email to:`, error);
        // Handle the error if needed
      }

      return res.status(200).send("Emails sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Internal Server Error");
    }
  });
});
