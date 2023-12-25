/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import * as emailTemplate from "email-template.html";
import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import template from "./emailTemplate";
import sgMail = require("@sendgrid/mail");

admin.initializeApp();
const db = admin.firestore();

export const getFamily = onRequest(
  { cors: true },
  async (request, response) => {
    try {
      const familyDocList = await db.collection("family").get();
      const familyObjects = [];
      for (const familyDoc of familyDocList.docs) {
        const familyData = familyDoc.data();
        familyData.id = familyDoc.id;
        familyObjects.push(familyData);
      }

      response.status(200).json(familyObjects);
    } catch (error) {
      console.error("Error occured fetching family objects:", error);
      response
        .status(500)
        .json({ error: "Error occured fetching family objects" });
    }
  }
);

export const completeFamilyById = onRequest(
  { cors: true },
  async (request, response) => {
    try {
      const familyId = request.params["0"];
      if (!familyId) {
        response.status(400).json({ error: "Missing ID parameter" });
        return;
      }

      const familyDocRef = db.collection("family").doc(familyId);
      if (familyDocRef) {
        await familyDocRef.update({ ["complete"]: true });
        response.status(200).json({ message: "Complete" });
      } else {
        response
          .status(404)
          .json({ error: "Family with provided id not found" });
      }
    } catch (error) {
      console.error("Error occured fetching family object by ID:", error);
      response
        .status(500)
        .json({ error: "Error occured fetching family object by ID" });
    }
  }
);

// export const sendEmail = onRequest(
//   { cors: true },
//   async (request, response) => {
//     try {
//       // const email = request.body?.email;
//       sgMail.setApiKey(
//       "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"
//       );
//       const msg = {
//         to: "njbrunner@gmail.com",
//         from: "njbrunner@gmail.com",
//         subject: "Chrismas Gift Card",
//         text: "emailTemplate",
//       };
//       sgMail
//         .send(msg)
//         .then(() => {
//           console.log("Email sent");
//           response.status(200).send("Successfully sent email");
//         })
//         .catch((error) => {
//           console.error(error);
//           response.status(error.status).json({ error: error.text });
//         });
//     } catch (error) {
//       console.error("Errror occured sending email to winner");
//       response
//         .status(500)
//         .json({ error: "Error occured sending meail to winner" });
//     }
//   }
// );

export const test = onRequest(
  { cors: true },
  async (request, response) => {
    try {
      // const email = request.params["0"];/
      const email = request.body["email"];
      sgMail.setApiKey(
        "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"
      );
      const msg = {
        to: email,
        from: "njbrunner@gmail.com",
        subject: "Chrismas Gift Card",
        html: template,
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log("Email sent");
          response.status(200).send("Successfully sent email");
        })
        .catch((error) => {
          console.error(error);
          response.status(error.status).json({ error: error.text });
        });
    } catch (error) {
      console.error("Errror occured sending email to winner");
      response
        .status(500)
        .json({ error: "Error occured sending meail to winner" });
    }
    response.status(200).json({ message: "This is a test message" });
  }
);
