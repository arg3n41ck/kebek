import React from "react";
import classes from "../../styles/provider.module.scss";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { makeStyles } from "@mui/styles";
import Tooltip from "@mui/material/Tooltip";

export interface IProductItem {
    id: number;
    title: string;
    image?: string;
}

type Props = {
    data: IProductItem;
};
const useStyles = makeStyles({
    noMaxWidth: {
        maxWidth: "300px",
        background: "white",
        color: "black",
        fontSize: "16px",
        lineHeight: "140%",
        fontFamily: "Rubik",
        border: "1px solid #E0E0E0",
        boxShadow: "-5px 20px 30px rgba(214, 231, 225, 0.292148)",
        padding: "20px",
        margin: "-60px",
    },
    arrow: {
        "&:before": {
            border: "1px solid #E6E8ED",
        },
        color: "#FFFFFF",
    },
});

const longText = (
    <ul>
        <li> ушки итальянские Taralli </li>
        <li>
            сдобное печенье «Арман», «Наурыз», «Топленое молоко», «Дуэт», «Гармония»
        </li>
        <li>сахарное печенье «Экзотика», «Бебек», «Шашу»</li>
    </ul>
);

const AllProductsInfo: React.FC<Props> = ({ data }) => {
    const muiStyles = useStyles();
    return (
        <div className={`col-3 ${classes.products__item}`}>
            <Tooltip
                title={longText}
                arrow
                placement="right-end"
                classes={{ arrow: muiStyles.arrow, tooltip: muiStyles.noMaxWidth }}
            >
                <Card>
                    <CardActionArea className={`${classes.products__card}`}>
                        <div className={classes.imageWrapper}>
                            <Image
                                className={classes.products__image}
                                width={130}
                                height={130}
                                src={data.image || "/images/no-image.png"}
                                alt={data.title}
                            />
                        </div>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h4" className={classes.products__itemTitle}>
                                {data.title}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Tooltip>
        </div>
    );
};

export default AllProductsInfo;
