"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function OneSignalSetup() {
 useEffect(() => {
  if (typeof window !== "undefined") {
   // Initialize OneSignal
   // We wrap this in a try-catch to prevent errors during development/SSR
   try {
    OneSignal.init({
     appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "",
     // You can add other initialization options here
     // notifyButton: {
     //   enable: true,
     // },
     allowLocalhostAsSecureOrigin: true,
    }).then(() => {
     console.log("OneSignal Initialized");
     OneSignal.Slidedown.promptPush(); // Prompt for push notifications
     OneSignal.User.PushSubscription.addEventListener("change", (event) => {
      console.log("Push subscription changed:", event);
     });
    });
   } catch (error) {
    console.error("OneSignal initialization failed:", error);
   }
  }
 }, []);

 return null;
}
