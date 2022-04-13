// import React from "react";
// import MoreVertIcon from "@mui/icons-material/MoreVert";

// import classes from "../../styles/Ordering.module.scss";
// import classNames from "classnames";
// import { editAdressModalCtx } from "../OrderingModals/EditAdressModal";
// import { deleteAdressModalCtx } from "../OrderingModals/DeleteAdressModal";

// interface Props {
//   handleDelete: Function,
//   className: string,
//   data: {
//     id: number,
//     address: string,
//     city: {
//       id: number
//       title_ru: string,
//       title_kk: string,
//       district: {
//         id: number,
//         title_ru: string,
//         title_kk: string
//       }
//     }
//   }
// }

// export default function MoreInfo({ className = "", handleDelete, data }: Props) {
//   const { setOpenEdit: setAdressEditModalOpen } =
//     React.useContext(editAdressModalCtx);
//   const openEditAdressModal = () => {
//     setAdressEditModalOpen(true);
//   };


//   const { setOpenDelete: setAdressDeleteModalOpen, setId } =
//     React.useContext(deleteAdressModalCtx);

//   const openDeleteAdressModal = (id) => {
//     setAdressDeleteModalOpen(true);
//     setId(id)
//   };

//   return (
//     <div className={classNames(classes.header__items__location, className)}>
//       <div
//         key="a"
//         className={classNames(classes.header__items__location__image)}
//       ></div>
//       <div key="b" className={classNames("flex", classes.tooltip)}>
//         <MoreVertIcon />
//         <div className={classes.bottom}>
//           <div className={classes.buttons_bottom}>
//             <div
//               onClick={openEditAdressModal}
//               className={classes.update_button}
//               key="updateBtn"
//             >
//               <p>Изменить</p>
//             </div>
//             <div
//               onClick={() => openDeleteAdressModal(data.id)}
//               className={classes.delete_button}
//               key="deleteBtn"

//             >
//               <p>Удалить</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from 'react';

function MoreInfo() {
  return <div>SIU</div>;
}

export default MoreInfo;
