import React from "react";
import { Routes, Route } from "react-router";
import Appliaction from "./Pages/Application/Application";
import Home from "./Pages/Home/Home";
import Notification from "./Pages/Notification/Notification";
import Auth from "./Pages/Auth/Auth";
import Staff from "./Pages/Staff/Staff";
import Payment from "./Pages/Payment/Payment";
import Goods from "./Pages/Goods/Goods";
import Delivery from "./Pages/Delivery/Delivery";
import Suppliers from "./Pages/Suppliers/Suppliers";
import UserAgreement from "./Pages/UserAgreement/UserAgreement";
import Faq from "./Pages/Faq/Faq";
import Contacts from "./Pages/Contacts/Contacts";
import Policy from "./Pages/Policy/Policy";
import SuppliersEdit from "./Pages/Suppliers/SuppliersEdit";
import AddStaff from "./Pages/Staff/AddStaff";
import AddPayment from "./Pages/Payment/AddPayment";
import EditPayment from "./Pages/Payment/EditPayment";
import AddDelivery from "./Pages/Delivery/AddDelivery";
import AddGoods from "./Pages/Goods/AddGoods";
import ApplicationItem from "./Pages/Application/ApplicationById";
import EditGoods from "./Pages/Goods/EditGoods";
import EditStaff from "./Pages/Staff/EditStaff";
import Profile from "./Pages/Profile/Profile";
import EditDelivery from "./Pages/Delivery/EditDelivery";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth/:token" element={<Auth />} />
      <Route path="/application" element={<Appliaction />} />
      <Route path="/notifications" element={<Notification />} />
      <Route path="/staff" element={<Staff />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment/add_payment" element={<AddPayment />} />
      <Route path="/payment/edit-payment/:id" element={<EditPayment />} />
      <Route path="/delivery/edit-delivery/:id" element={<EditDelivery />} />
      <Route path="/goods" element={<Goods />} />
      <Route path="/delivery" element={<Delivery />} />
      <Route path="/delivery/add_delivery" element={<AddDelivery />} />
      <Route path="/suppliers" element={<Suppliers />} />
      <Route path="/suppliers/suppliers-edit/:id" element={<SuppliersEdit />} />
      <Route path="/user-agreement" element={<UserAgreement />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/staff/add-staff" element={<AddStaff />} />
      <Route path="/privacy-policy" element={<Policy />} />
      <Route path="/goods/add-goods" element={<AddGoods />} />
      <Route path="/application/:id" element={<ApplicationItem />} />
      <Route path="/goods/edit-goods/:id" element={<EditGoods />} />
      <Route path="/staff/edit-staff/:id" element={<EditStaff />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default Router;
