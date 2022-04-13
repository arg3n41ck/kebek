import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainWrapperAdmin from "./components/MainWrapperAdmin/MainWrapper";
import Router from "./Router";
import "bootstrap/dist/css/bootstrap.min.css";
import UserProvider from "./providers/UserProvider";
import { StylesProvider } from "@mui/styles";
// import OrdersProvider from "./providers/OrdersProvider";
import NotificationsProvider from "./providers/NotificationsProvider";
import LocaleProvider from "./providers/LocaleProvider";
import ProfileProvider from "./Context/ProfileContext";
import GoodsProvider from "./providers/GoodsProvider";
import PaymentProvider from "./providers/PaymentProvider";
import StaffProvider from "./providers/StaffProvider";
import DeliveryProvider from "./providers/DeliveriesProvider";
import ApplicationProvider from "./providers/ApplicationProvider";

function App() {
  return (
    <StylesProvider injectFirst>
      <BrowserRouter basename="/OW">
        <UserProvider>
          <ProfileProvider>
            <LocaleProvider>
              <NotificationsProvider>
                <GoodsProvider>
                  <PaymentProvider>
                    <StaffProvider>
                      <DeliveryProvider>
                        <ApplicationProvider>
                          <MainWrapperAdmin>
                            <Router />
                          </MainWrapperAdmin>
                        </ApplicationProvider>
                      </DeliveryProvider>
                    </StaffProvider>
                  </PaymentProvider>
                </GoodsProvider>
              </NotificationsProvider>
            </LocaleProvider>
          </ProfileProvider>
        </UserProvider>
      </BrowserRouter>
    </StylesProvider>
  );
}

export default App;
