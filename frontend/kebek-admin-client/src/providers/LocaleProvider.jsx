import React from "react";
import { createContext } from "react";
import ru from "../location/ru/translation.json";
import kz from "../location/kz/translation.json";

export const localeContext = createContext(null);

export default function LocaleProvider({ children }) {
    const [locale, setLocale] = React.useState(localStorage.getItem("locale"));
    const lang = locale === "ru" ? ru : kz
    const [t, setT] = React.useState(lang);

    React.useEffect(() => {
        localStorage.setItem("locale", locale);
        setT(lang);
    }, [locale]);

    return (
        <localeContext.Provider
            value={{
                t,
                setT,
                locale,
                setLocale,
            }}
        >
            {children}
        </localeContext.Provider>
    );
}
