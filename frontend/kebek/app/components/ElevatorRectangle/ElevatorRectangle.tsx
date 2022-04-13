import classes from './ElevatorRectangle.module.scss'
import checkBoxTrue from '../../assets/icons/checkboxTrue.svg'
import checkBox from '../../assets/icons/checkbox.svg'
import Image from 'next/image'
import { useState } from 'react'
import $api from '../../utils/axios'
import React from 'react'
import Backdrop from '@mui/base/BackdropUnstyled';
import Truncate from 'react-truncate';

export default function ElevatorModal() {

    const [check, setCheck] = useState(false)

    return (
        <>
            {
                check ? (
                    <div className={classes.container} onClick={() => {
                        setCheck(!check)
                    }
                    }
                        style={{ cursor: "pointer", border: "1px solid #219653", boxShadow: "-5px 20px 30px rgba(214, 231, 225, 0.292148)" }}>
                        <div className={classes.name}>
                            <Truncate className={classes.truncate} style={{ display: 'block' }} ellipsis="..."
                                lines={1}>«Ново-Альджанский Мелькомбинат»
                            </Truncate>

                        </div>
                        <div className={classes.adress}>
                            01000, г. Нур-Султан, ул. Петухова, д.71
                        </div>
                    </div >
                ) : (
                    <div className={classes.container} onClick={() => {
                        setCheck(!check)
                    }
                    }
                        style={{ cursor: "pointer" }}>
                        <div className={classes.name} style={{ display: 'flex' }}>

                            <Truncate className={classes.truncate} style={{ display: 'block' }} ellipsis="..."
                                lines={1}><b>«Ново-Альджанский Мелькомбинат»</b>
                            </Truncate>

                        </div>
                        <div className={classes.adress}>
                            01000, г. Нур-Султан, ул. Петухова, д.71
                        </div>
                    </div>
                )}
        </>
    );
}
