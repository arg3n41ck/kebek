import { Container } from 'react-bootstrap'
import classes from './ElevatorCard.module.scss'
import StraightLine from '../../assets/icons/straightLine.svg'
import Image from 'next/image'
import Asema from '../../assets/icons/asemaPhoto.svg'

export default function ElevatorCard() {

    return (
        <>
            <Container style={{
                maxWidth: "580px", height: "550px", border: "1px solid #E0E0E0", color: "rgba(9, 47, 51, 1)", padding: "20px", marginTop: "100px"
            }}>
                <div className="row" style={{ height: "22%" }}>
                    <div className="col-12">
                        <h3 style={{ fontSize: "25px" }}>«Ново-Альджанский Мелькомбинат»</h3>
                        <p>предприятие с 25-летней историей. Мелькомбинат одним из первых включился в проект по фортификации муки, разработанный...</p>
                    </div>
                </div>
                <div className="row" style={{ height: "35%", background: "#FAFCFA", fontSize: "18px" }}>
                    <div className="row" style={{ marginBottom: "0" }}>
                        <div className="col-6">
                            <p className="namingFirst" style={{ color: "rgba(130, 130, 130, 1)" }}>
                                Наименование
                            </p>

                            <p className="descriptionFirst">
                                Отруби в мешках
                            </p>
                        </div>

                        <div className="col-6">
                            <p className="forKilo" style={{ color: "rgba(130, 130, 130, 1)" }}>
                                Цена за кг
                            </p>

                            <p className="priceForKilo">
                                87 ₸
                            </p>
                        </div>
                    </div>
                    <Image src={StraightLine} alt="" />
                    <div className="row" style={{ marginTop: "6px" }}>
                        <div className="col-6">
                            <p className="namingSecond" style={{ color: "rgba(130, 130, 130, 1)" }}>
                                Наименование
                            </p>

                            <p className="descriptionSecond">
                                Отруби россыпью
                            </p>
                        </div>

                        <div className="col-6">
                            <p className="forKilo" style={{ color: "rgba(130, 130, 130, 1)" }}>
                                Цена за кг
                            </p>

                            <p className="priceForKilo">
                                75 ₸
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row" style={{ height: "25%" }}>
                    <p className="" style={{ fontSize: "25px", fontWeight: "500" }}> Контакты</p>
                    <div className="row">
                        <div className="col-2" style={{ paddingRight: "0" }}>
                            <Image src={Asema} alt="" />
                        </div>

                        <div className="col-4" style={{ padding: "0" }} >
                            <p style={{ color: "rgba(48, 48, 48, 1)", fontSize: "20px", fontWeight: "400", marginBottom: "0" }}>Асема Сергазина</p>
                            <p className="profession" style={{ color: "rgba(130, 130, 130, 1)" }}>Менеджер</p>
                        </div>

                        <div className="col-6">
                            <button className={classes.numberButton}>+7 700 070 70 07</button>
                        </div>
                    </div>
                </div>

                <Image src={StraightLine} alt="" />

                <div className="row" style={{ height: "18%", fontSize: "18px", fontWeight: "400" }}>
                    <p style={{ color: "rgba(130, 130, 130, 1)", marginTop: "10px" }}>Адрес</p>
                    <p >01000, г. Нур-Султан, ул. Петухова, д.71</p>
                </div>

            </Container>
        </>
    )
}