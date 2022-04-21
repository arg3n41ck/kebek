import React from "react";
import classNames from "classnames";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Radio from "@mui/material/Radio";
import AccordionDetails from "@mui/material/AccordionDetails";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import FormControlLabel from "@mui/material/FormControlLabel";
import TabsUnstyled from "@mui/base/TabsUnstyled";
import TabsListUnstyled from "@mui/base/TabsListUnstyled";
import TabPanelUnstyled from "@mui/base/TabPanelUnstyled";
import TabUnstyled from "@mui/base/TabUnstyled";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { IconButton } from "@mui/material";

import classes from "../../styles/Ordering.module.scss";
import { modalAdressAddCtx } from "../OrderingModals/AddAdressModal";

import MoreVertIcon from "@mui/icons-material/MoreVert";

import { editAdressModalCtx } from "../OrderingModals/EditAdressModal";
import { deleteAdressModalCtx } from "../OrderingModals/DeleteAdressModal";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux/hooks";
import { useRouter } from "next/router";

interface Stations {
  id: number,
  code: null | string,
  description_ru: string,
  description_kk: string,
  title_ru: string,
  title_kk: string,
}

interface Props {
  className: string,
  data: {
    id: number,
    address: string,
    city: {
      id: number
      title_ru: string,
      title_kk: string,
      district: {
        id: number,
        title_ru: string,
        title_kk: string
      }
    }
  }
}

export const MoreInfo = ({ className = "", data }: Props) => {
  const { setOpenEdit: setAdressEditModalOpen, setData } = React.useContext(editAdressModalCtx);
  const { t } = useTranslation()

  const openEditAdressModal = (data: any) => {
    setAdressEditModalOpen(true);
    setData(data)
  };



  const { setOpenDelete: setAdressDeleteModalOpen, setId } = React.useContext(deleteAdressModalCtx);

  const openDeleteAdressModal = (id: number) => {
    setAdressDeleteModalOpen(true);
    setId(id)
  };

  return (
    <div className={classNames(classes.header__items__location, className)}>
      <div className={classNames(classes.header__items__location__image)} />
      <div className={classNames("flex", classes.tooltip)}>
        <MoreVertIcon />
        <div className={classes.bottom}>
          <div className={classes.buttons_bottom}>
            <div
              onClick={() => openEditAdressModal(data)}
              className={classes.update_button}
            >
              {t("ordering.accordions.accordion3.modals.title1")}
            </div>
            <div
              onClick={() => openDeleteAdressModal(data.id)}
              className={classes.delete_button}
            >
              {t("ordering.accordions.accordion3.modals.title2")}
            </div>
            <i />
          </div>
        </div>
      </div>
    </div>
  );
};

function MethodOfObtainingAccordion({ radioDelivery, setRadioDelivery, deliveryTab, setDeliveryTab, setAddress, address }: any) {
  const { delivery } = useAppSelector((state) => state.auth);
  const { t } = useTranslation()
  const { stations } = useAppSelector((state) => state.product);
  const addresses: any = useAppSelector((state) => state.auth.addresses);
  const router = useRouter()

  const handleClick = (item: any) => {
    setAddress(item)
  }
  const styleChangeDostavka = (id: number) => {
    setDeliveryTab(id)
  };

  const stationsComplete = stations?.map((item: Stations) => (router.locale === "ru" ? {
    label: item.description_ru,
    id: item.id
  } : { label: item.description_kk, id: item.id })) || [];

  const handleChangeRadioDelivery = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRadioDelivery((event.target as HTMLInputElement).value);
  };
  const { setOpenAdd: setAdressAddModalOpen } = React.useContext(modalAdressAddCtx);

  const openAddAdressModal = () => {
    setAdressAddModalOpen(true);
  };

  return (
    <div>
      <Accordion
        defaultExpanded
        className={classNames("mb-4", classes.accordion)}
      >
        <AccordionSummary expandIcon={<ArrowForwardIosSharpIcon />}>
          <Typography sx={{ fontSize: 21 }}>{t("ordering.accordions.accordion3.heading3")}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TabsUnstyled defaultValue={0}>
            <TabsListUnstyled className={"d-flex"}>
              {!!delivery?.length && delivery.map((item: any) => (
                <>
                  {!!item.deliveries &&
                    item.deliveries.filter(({ status }: any) => status === "AC").map((elem: any) => {
                      const id = (elem.type.title_ru === "Доставка" || elem.type.title_kk === "Жеткізу") && elem.type.id
                      
                      return <TabUnstyled
                        key={elem.type.id}
                        disabled={elem.type.id === id}
                        type="button"
                        style={
                          deliveryTab === elem.type.id
                            ? { color: "#219653", borderColor: "#219653" }
                            : { color: "#092F33", borderColor: "#EEEEEE" }
                        }
                        onClick={() => styleChangeDostavka(elem.type.id)}
                        className={classes.tabUnstyled}
                      >
                        {elem &&
                          router.locale === "ru" ? elem.type.title_ru : elem.type.title_kk
                        }
                      </TabUnstyled>
                    })

                  }
                </>
              ))}
            </TabsListUnstyled>
            <TabPanelUnstyled value={0}>
              <Typography
                className={"mt-4"}
                sx={{ fontSize: 16 }}
                color="#828282"
              >
                {t("ordering.accordions.accordion3.delivery.title3")}
              </Typography>
            </TabPanelUnstyled>
            <TabPanelUnstyled value={1}>
              <FormControl className={classes.FormControl}>
                <RadioGroup
                  value={radioDelivery}
                  onChange={handleChangeRadioDelivery}
                >
                  <div className={classNames("mt-4", classes.railwayВelivery)}>
                    <FormControlLabel
                      value="railwayВelivery"
                      control={<Radio />}
                      label={
                        <Typography
                          color={
                            radioDelivery === "railwayВelivery"
                              ? "primary"
                              : "black"
                          }
                        >
                          {t("ordering.accordions.accordion3.delivery.title1")}
                        </Typography>
                      }
                    />
                    <Autocomplete
                      className={classNames(classes.autoComplete, "mt-2")}
                      disablePortal
                      id="combo-box-demo"
                      options={stationsComplete}
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField {...params} placeholder={t("ordering.accordions.accordion3.delivery.title11")} />
                      )}
                    />
                  </div>
                  <div className={classNames(classes.FormControl, "mt-3")}>
                    <FormControlLabel
                      value="autoDelivery"
                      control={<Radio />}
                      label={
                        <Typography
                          color={
                            radioDelivery === "autoDelivery"
                              ? "primary"
                              : "black"
                          }
                        >
                          {t("ordering.accordions.accordion3.delivery.title2")}
                        </Typography>
                      }
                    />
                    <div
                      className={
                        "d-flex align-items-center justify-content-between"
                      }
                    >
                      <Typography className={classes.saveAdress} sx={{ fontSize: 21, fontWeight: 400 }}>
                        {t("ordering.accordions.accordion3.delivery.title22")}
                      </Typography>
                      <button
                        onClick={openAddAdressModal}
                        style={{
                          background: "none",
                          color: "rgba(33, 150, 83, 1)",
                          fontSize: "18px",
                          border: "0px",
                        }}
                        className={classes.adressModal}
                      >
                        + {t("ordering.accordions.accordion3.delivery.title222")}
                      </button>
                    </div>
                    {!!addresses && addresses.map((item: any) => (
                      <div
                        onClick={() => handleClick(item)}
                        style={address?.id === item.id ? {
                          height: 76,
                          border: "1px solid #219653",
                          borderRadius: 3,
                        } : {
                          height: 76,
                          border: "1px solid #E0E0E0",
                          borderRadius: 3,
                        }}
                        key={item.id}
                        className={
                          "d-flex mt-2 align-items-center justify-content-between"
                        }
                      >
                        <div className={"w-100 d-flex align-items-center justify-content-between"} style={{ cursor: "pointer" }} >
                          <div className={"d-flex align-items-center"} style={{ padding: "14px 20px" }}>
                            <Typography sx={{ fontSize: 18, fontWeight: 400 }}>
                              {router.locale === "ru" ? item.city.title_ru : item.city.title_kk},
                            </Typography>
                            <Typography sx={{ fontSize: 18, fontWeight: 400, marginLeft: 1 }}>
                              {item.address}
                            </Typography>
                          </div>
                          <IconButton color="success">
                            <MoreInfo data={item} className="d-sm-flex" />
                          </IconButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </FormControl>
            </TabPanelUnstyled>
          </TabsUnstyled>
        </AccordionDetails>
      </Accordion>
    </div >
  );
}

export default MethodOfObtainingAccordion;
