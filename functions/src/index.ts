/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";

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
