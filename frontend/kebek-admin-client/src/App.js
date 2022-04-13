import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainWrapperAdmin from "./components/MainWrapperAdmin/MainWrapper";
import Router from "./Router";
import "bootstrap/dist/css/bootstrap.min.css";
import UserProvider from "./providers/UserProvider";
import { StylesProvider } from "@mui/styles";
import OrdersProvider from "./providers/OrdersProvider";
import NotificationsProvider from "./providers/NotificationsProvider";
import ProfileProvider from "./Context/ProfileContext";
import LocaleProvider from "./providers/LocaleProvider";

function App() {
  return (
    <StylesProvider injectFirst>
      <BrowserRouter basename="/CL">
        <LocaleProvider>
          <UserProvider>
            <ProfileProvider>
              <OrdersProvider>
                <NotificationsProvider>
                  <MainWrapperAdmin>
                    <Router />
                  </MainWrapperAdmin>
                </NotificationsProvider>
              </OrdersProvider>
            </ProfileProvider>
          </UserProvider>
        </LocaleProvider>
      </BrowserRouter>
    </StylesProvider>
  );
}

export default App;
