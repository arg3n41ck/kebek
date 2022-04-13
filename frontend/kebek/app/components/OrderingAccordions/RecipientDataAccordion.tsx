import React from 'react'
import classes from "../../styles/Ordering.module.scss"
import { Accordion, AccordionSummary, Radio, AccordionDetails, FormControl, Typography, RadioGroup, FormControlLabel } from "@mui/material"
import { TabsListUnstyled, TabPanelUnstyled, TabUnstyled } from '@mui/base';
import classNames from "classnames"
import ReactInputMask from "react-input-mask"
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { useTranslation } from 'react-i18next';


function RecipientDataAccordion({ radioFace, setRadioFace, values, handleChange, handleBlur, errors, touched }: any) {
    const { t } = useTranslation()

    const handleChangeRadioFace = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadioFace((event.target as HTMLInputElement).value);
    };

    return (
        <div>
            <Accordion defaultExpanded className={classNames("mt-4 mb-4", classes.accordion, classes.accardionFirst)}>
                <AccordionSummary
                    expandIcon={<ArrowForwardIosSharpIcon />}
                >
                    <Typography sx={{ fontSize: 21 }}>{t("ordering.accordions.accordion1.heading")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormControl sx={{ width: '100%' }}>
                        <RadioGroup
                            value={radioFace}
                            onChange={handleChangeRadioFace}
                        >
                            <div>
                                <TabsListUnstyled>
                                    <TabUnstyled
                                        type="button"
                                        style={{ background: 'none', border: 'none' }}>
                                        <FormControlLabel
                                            value="individual"
                                            control={<Radio />}
                                            label={
                                                <Typography
                                                    color={radioFace === "individual" ? "primary" : "black"}>
                                                    {t("ordering.accordions.accordion1.title1")}
                                                </Typography>
                                            }
                                        />
                                    </TabUnstyled>
                                    <TabUnstyled
                                        type="button"
                                        style={{ background: 'none', border: 'none' }}>
                                        <FormControlLabel value="entity" control={<Radio />}
                                            label={<Typography
                                                color={radioFace === "entity" ? "primary" : "black"}>
                                                {t("ordering.accordions.accordion1.title2")}
                                            </Typography>}
                                        />
                                    </TabUnstyled>
                                </TabsListUnstyled>
                                <TabPanelUnstyled value={0}>
                                    <input
                                        style={errors.fullName && touched.fullName ? { borderColor: "red" } : undefined}
                                        value={values.fullName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        name="fullName"
                                        className={"col-md-12 col-12 mb-4 mt-3"}
                                        type="text"
                                        placeholder={t("ordering.accordions.accordion1.input1.title1")}
                                    />
                                    <div className={classNames("col-md-12 d-flex justify-content-between", classes.inputsForm)}>
                                        <ReactInputMask
                                            style={errors.phoneNumber && touched.phoneNumber ? { borderColor: "red" } : undefined}
                                            mask="+7(999)9999999"
                                            type="text"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="phoneNumber"
                                            placeholder={t("ordering.accordions.accordion1.input1.title2")}
                                            value={values.phoneNumber}
                                        />
                                        <input
                                            style={errors.email && touched.email ? { borderColor: "red" } : undefined}
                                            value={values.email}
                                            type="email"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="email"
                                            placeholder={t("ordering.accordions.accordion1.input1.title3")}
                                        />
                                    </div>
                                </TabPanelUnstyled>
                                <TabPanelUnstyled className={"mt-3"} value={1}>
                                    <input
                                        style={errors.fullName && touched.fullName ? { borderColor: "red" } : undefined}
                                        value={values.fullName}
                                        onChange={handleChange}
                                        className={"col-md-12 col-12 mb-4"}
                                        type="text"
                                        onBlur={handleBlur}
                                        name="fullName"
                                        placeholder={t("ordering.accordions.accordion1.input2.title1")}
                                    />
                                    <div className={classNames("col-md-12 d-flex justify-content-between", classes.inputsForm)}>
                                        <ReactInputMask
                                            style={errors.phoneNumber && touched.phoneNumber ? { borderColor: "red" } : undefined}
                                            className={"col-sm-12"}
                                            mask="+7(999)9999999"
                                            type="text"
                                            placeholder={t("ordering.accordions.accordion1.input1.title2")}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="phoneNumber"
                                            value={values.phoneNumber}
                                        />
                                        <input
                                            style={errors.email && touched.email ? { borderColor: "red" } : undefined}
                                            className={"col-sm-12"}
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="email"
                                            type="email"
                                            placeholder={t("ordering.accordions.accordion1.input1.title3")}
                                        />
                                    </div>
                                </TabPanelUnstyled>
                            </div>
                        </RadioGroup>
                    </FormControl>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

export default RecipientDataAccordion
