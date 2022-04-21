import classes from "./cookie.module.scss";
import Image from "next/image";
import cookiesIcon from "../../assets/icons/cookies.svg";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Cookie() {
  const [show, setShow] = useState<{ choice: string, isFirstChoice: boolean }>({ choice: 'disagree', isFirstChoice: true });
  const router = useRouter();

  const hideBlock = (choice: string) => {
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
    // <div></div>
    <div
      className={classNames("fixed-bottom", classes.container)}
      style={
        (show.choice === 'disagree' && show.isFirstChoice) ?
          { display: "flex" } :
          { display: "none" }
      }
    >
      <div className={classes.content}>
        <div className={classes.cookiesIcon}>
          <Image src={cookiesIcon} alt="" />
        </div>

        <div className={classes.text}>
          <p className={classes.firstLine}>
            <b>
              {router.locale === "ru" ? "Мы используем файлы cookie, чтобы Вам было удобнее пользоваться нашим сайтом." : "Біз cookie файлдарын веб-сайтымыздағы тәжірибеңізді жақсарту үшін пайдаланамыз."}
            </b>
          </p>
          <p className={classes.secondLine}>
            {router.locale === "ru" ? "Используя наш сайт, Вы даете согласие на использование файлов cookie." : "Біздің сайтты пайдалану арқылы сіз cookie файлдарын пайдалануға келісесіз."}
            <a href="https://policies.google.com/technologies/cookies?hl=ru">
              <span>{router.locale === "ru" ? "Узнать больше" : "Көбірек білу үшін"}</span>
            </a>
          </p>
        </div>

        <div className={classes.buttons}>
          <button className={classes.button1} onClick={() => hideBlock("disagree")}>
            {router.locale === "ru" ? "Отклонить" : "Қабылдамау"}
          </button>

          <button className={classes.button2} onClick={() => hideBlock("agree")}>
            {router.locale === "ru" ? "Разрешить все" : "Барлығына рұқсат етіңіз"}
          </button>
        </div>
      </div>
    </div>
  );
}
