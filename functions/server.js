const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
const nodemailer = require("nodemailer");
const cors = require("cors");

// Load environment variables from .env.local in development
require("dotenv").config({ path: '../.env.local' });
const schedule = require("node-schedule");

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mnc-development-default-rtdb.firebaseio.com",
});

let stripeSecretKey;

// Set up Stripe API key based on environment
if (process.env.NODE_ENV === 'production') {
  stripeSecretKey = functions.config().stripe.secret; // Use Firebase config in production
} else {
  stripeSecretKey = process.env.STRIPE_SECRET_KEY; // Use local .env.local in development
}

const stripe = require('stripe')(stripeSecretKey);

// Firestore database reference
const db = admin.firestore();

// Allowed origins for CORS
const allowedOrigins = ['http://localhost:5175', 'https://us-central1-mnc-development.cloudfunctions.net'];

// CORS options setup
const corsOptions = {
  origin: (origin, callback) => {
    // Check if the incoming origin is in the list of allowed origins or if no origin is provided (like in server-to-server requests)
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

// Function to handle preflight CORS requests
const handleCors = (req, res) => {
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Origin', req.headers.origin);
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send(''); // Send a 204 response for preflight requests
  }
};

// Create Payment Intent endpoint for Stripe
exports.createPaymentIntent = functions.https.onRequest((req, res) => {
  cors(corsOptions)(req, res, async () => {
    handleCors(req, res); // Handle preflight requests

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

      res.set('Access-Control-Allow-Origin', req.headers.origin); // Dynamically set the allowed origin
      res.status(200).send({
        clientSecret: paymentIntent.client_secret, // Return the client secret to the frontend
      });
    } catch (error) {
      console.error('Error creating PaymentIntent:', error);
      res.status(500).send({
        error: error.message || 'Failed to create payment intent',
      });
    }
  });
});

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

exports.deleteUser = functions.https.onCall(async (data, context) => {
  try {
    // Ensure the request is authenticated and user is an admin
    if (!context.auth || !["admin", "superadmin"].includes(context.auth.token.role)) {
      console.error("Unauthorized access attempt");
      return { error: "Unauthorized request" };
    }

    const { userId } = data;
    if (!userId) {
      console.error("Missing userId in request");
      return { error: "User ID is required" };
    }

    // Step 1: Delete the user from Firebase Authentication
    try {
      await admin.auth().deleteUser(userId);
      console.log(`Successfully deleted user from Firebase Auth: ${userId}`);
    } catch (authError) {
      console.error("Error deleting user from Firebase Authentication:", authError);
      return { error: "Failed to delete user from Authentication" };
    }

    // Step 2: Delete the user document from Firestore
    try {
      await db.collection("users").doc(userId).delete();
      console.log(`Successfully deleted user from Firestore: ${userId}`);
    } catch (firestoreError) {
      console.error("Error deleting user from Firestore:", firestoreError);
      return { error: "Failed to delete user from Firestore" };
    }

    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "Internal Server Error" };
  }
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