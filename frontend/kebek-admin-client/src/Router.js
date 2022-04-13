import React from "react";
import { Routes, Route } from "react-router";
import Appliaction from "./Pages/Application/Appliaction";
import Details from "./Pages/Details/Details";
import Home from "./Pages/Home/Home";
import Notification from "./Pages/Notification/Notification";
import Profile from "./Pages/Profile/Profile";
import Auth from "./Pages/Auth/Auth";
import UserAgreement from "./Pages/UserAgreement/UserAgreement";
import Faq from "./Pages/Faq/Faq";
import Contacts from "./Pages/Contacts/Contacts";
import Policy from "./Pages/Policy/Policy";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/:token" element={<Auth />} />
      <Route path="/application" element={<Appliaction />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/notifications" element={<Notification />} />
      <Route path="/info-about-application/:id" element={<Details />} />
      <Route path="/user-agreement" element={<UserAgreement />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/privacy-policy" element={<Policy />} />
      <Route path="/contacts" element={<Contacts />} />
    </Routes>
  );
}

export default Router;
