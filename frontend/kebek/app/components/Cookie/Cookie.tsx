import classes from "./cookie.module.scss";
import Image from "next/image";
import cookiesIcon from "../../assets/icons/cookies.svg";
import classNames from "classnames";
import { useEffect, useState } from "react";

export default function Cookie() {
  const [show, setShow] = useState<{ choice: string, isFirstChoice: boolean }>({ choice: 'disagree', isFirstChoice: true });

  const hideBlock = (choice: boolean) => {
    const userChoiceToStore = choice ? 'agree' : 'disagree';
    setShow({
      choice: userChoiceToStore,
      isFirstChoice: false
    });
    window.localStorage.setItem("showCookiesNotification", JSON.stringify({ choice: userChoiceToStore, isFirstChoice: true }));
  };

  useEffect(() => {
    if (!!window) {
      const LSShowCookiesNotification = window.localStorage.getItem("showCookiesNotification") || null;
      const showNotification = !!LSShowCookiesNotification ? JSON.parse(`${LSShowCookiesNotification}`) : { choice: 'disagree', isFirstChoice: true };
      // @ts-ignore
      setShow(showNotification);
    }
  }, [window]);

  return (
    <div></div>
    // <div
    //   className={classNames("fixed-bottom", classes.container)}
    //   style={
    //     (show.choice === 'disagree' && show.isFirstChoice) ?
    //       { display: "flex" } :
    //       { display: "none" }
    //   }
    // >
    //   <div className={classes.content}>
    //     <div className={classes.cookiesIcon}>
    //       <Image src={cookiesIcon} alt="" />
    //     </div>

    //     <div className={classes.text}>
    //       <p className={classes.firstLine}>
    //         <b>
    //           Мы используем файлы cookie, чтобы Вам было удобнее пользоваться
    //           нашим сайтом.
    //         </b>
    //       </p>
    //       <p className={classes.secondLine}>
    //         Используя наш сайт, Вы даете согласие на использование файлов
    //         cookie.{" "}
    //         <a href="https://policies.google.com/technologies/cookies?hl=ru">
    //           <span>Узнать больше</span>
    //         </a>
    //       </p>
    //     </div>

    //     <div className={classes.buttons}>
    //       <button className={classes.button1} onClick={() => hideBlock(false)}>
    //         Отклонить
    //       </button>

    //       <button className={classes.button2} onClick={() => hideBlock(true)}>
    //         Разрешить все
    //       </button>
    //     </div>
    //   </div>
    // </div>
  );
}
