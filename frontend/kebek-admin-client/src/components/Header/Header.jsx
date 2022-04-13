import React from "react";
import cl from "./Header.module.scss";
import burgerMenu from "../../static/icons/burgerMenu.svg";
import Locale from "../Location/Locale";
import AvatarUser from "../Location/AvatarUser";
import { userContext } from "../../providers/UserProvider";

export default function Header({ handleDrawerOpen, open, setLocale, locale }) {
  const { user } = React.useContext(userContext);

  return (
    <div className={cl.header}>
      {!open && (
        <div className={cl.burger} onClick={handleDrawerOpen}>
          <img src={burgerMenu} />
        </div>
      )}
      <div className={cl.header__items}>
        <AvatarUser data={user} />
        <Locale locale={locale} setLocale={setLocale} />
      </div>
    </div>
  );
}