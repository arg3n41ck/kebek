import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import classes from "./faq.module.scss";
import classNames from "classnames"
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { useRouter } from "next/router";
export interface IFaqItem {
  id: number;
  answer: string;
  question: string;
}

type Props = {
  data: IFaqItem;
  col: string;
  key: number
};



function formatMyText(text: string): string {
  let b = text.replace(/\n|(\r\n)/g, '<br/>')
  const matches = b.match(/(\<br\/\>|^)[^<]+\:\<br\/\>/gi) || [];
  let result = matches.reduce((a, b) => {
    return a.replace(b, `${b}`);
  }, b)
  return result;
}

const FaqItem: React.FC<Props> = ({ data, key, col }) => {
  return (
    <div key={key}>
      <Accordion style={{ boxShadow: "none" }}>
        <AccordionSummary
          expandIcon={<ArrowForwardIosSharpIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          style={{
            padding: "0",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <Typography style={{ marginLeft: 24, color: 'darkgreen' }} component="h2" className={classes.faq__generalInfo}>
            {data.question}
          </Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.faq__content}>
          <div dangerouslySetInnerHTML={
            { __html: formatMyText(data.answer) }
          } ></div>
        </AccordionDetails>
      </Accordion>
      {col === "1" && <hr className={classes.hr_mobile} />}
      {/* {data.id == 3 && <hr className={classes.hr_mobile1} />} */}
      {col === "1" && <hr className={classNames("d-none", classes.hr_mobile2)} />}

    </div >
  );
};

export default FaqItem;
