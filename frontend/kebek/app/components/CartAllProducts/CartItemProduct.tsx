import React, { FC } from "react";
import classNames from "classnames";
import { useAppDispatch } from "../../redux/hooks";
import { CartItem } from "../../types/products";
import classes from "../../styles/AllProductsCart.module.scss";
import DeleteProductModal from "../DeleteProductModal/DeleteProductModal";
import { changeCartItemCount } from "../../redux/products/cart.slice";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

type Props = {
	data: CartItem;
};

const CartItemProduct: FC<Props> = ({ data }) => {
	const dispatch = useAppDispatch();
	const router = useRouter()
	const { t } = useTranslation()


	const increaseCartNumberOfTons = () => {
		if (data.count + 1 <= data.residue / 1000 && data.count + 1 <= data.max_limit / 1000) return dispatch(changeCartItemCount({ id: data.id, count: data.count + 1 }));
	};


	const decreaseCartNumberOfTons = () => {
		if (data.count - 1 <= 0) return;
		dispatch(changeCartItemCount({ id: data.id, count: data.count - 1 }));
	};

	return (
		<div>
			<div className="row align-items-center">
				<div
					className={classNames(
						"col-12 mt-3 d-flex justify-content-start",
						classes.ton__text
					)}
					style={{ color: "#092F33", fontSize: "16px", fontWeight: "normal" }}
				>
					{router.locale === "ru" ? data.type.title_ru : data.type.title_kk}
				</div>
				<div
					className={classNames(
						"col-12 mt-3 d-flex justify-content-start",
						classes.ton__text
					)}
					style={{ color: "#219653", fontSize: "16px", fontWeight: "300" }}
				>
					{router.locale === "ru" ? data.elevator.title_ru : data.elevator.title_kk}
				</div>
				<div
					className={classNames(
						"col-12 mt-3 d-flex justify-content-start",
						classes.ton__text
					)}
					style={{ color: "#092F33", fontSize: "12px", fontWeight: "normal" }}
				>
					{t("allProducts.cart.title1")}:
				</div>
			</div>
			<div className="row mt-2">
				<div className={`col-md-6 col-6 d-flex flex-row ${classes.p}`}>
					<button
						onClick={decreaseCartNumberOfTons}
						className={classes.minusButton}
					>
						-
					</button>
					<p className="mx-3">{Math.round(data.count)}</p>
					<button
						onClick={increaseCartNumberOfTons}
						className={classes.plusButton}
					>
						+
					</button>
				</div>
				<div className="col-md-6 col-6 d-flex justify-content-end">
					<DeleteProductModal data={data} />
				</div>
			</div>
		</div>
	);
};

export default CartItemProduct;
