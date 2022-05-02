import React, { useState } from "react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";
import Modal from "../common/Modal";
import * as ModalTemplates from "../../common/types/ModalTemplates";

import storeService from "../../services/store.service";

const OrderDetail = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [order, setOrder] = useState(props.location.query?.order);
	const [modalSetting, setModalSetting] = useState({
		...ModalTemplates.ModalCancelOrder,
	});

	const getOrderTotal = () => {
		return order.detail.reduce(
			(previousValue, p) => previousValue + +p.amount * +p.product.price,
			0
		);
	};

	const closeModal = () => {
		setModalSetting({ ...modalSetting, show: false });
	};

	const handleCancelOrder = () => {
		setErrorMessage("");
		setModalSetting({
			...modalSetting,
			okFn: cancelOrder,
			cancelFn: closeModal,
			show: true,
		});
	};

	const cancelOrder = () => {
		setIsLoading(true);
		setModalSetting({ ...modalSetting, show: false });

		storeService
			.cancelOrder(order.orderId)
			.then(({ data }) => {
				setOrder({ ...order, status: "canceled" });
			})
			.finally(() => setIsLoading(false))
			.catch((err) => {
				setErrorMessage(err.message);
			});
	};

	return (
		<React.Fragment>
			<Header />
			<Modal {...modalSetting} />
			{isLoading && <LoadingBar />}
			{errorMessage && (
				<p className="mt-2 text-sm p-2 text-white bg-red-700">{errorMessage}</p>
			)}
			<main className="max-w-screen-xl mx-auto p-4 min-h-screen">
				<div className="w-full h-screen md:max-w-md md:rounded-sm md:mx-auto md:h-auto relative min-h-screen mb-10">
					<h1 className="text-4xl text-center">Detalle de orden</h1>
					{order && (
						<>
							<table className="border-separate text-left border-flame-700 mt-5 w-full">
								<tbody>
									<tr>
										<th className="border-t-2 border-yellow-900 text-center">
											Orden
										</th>
										<td className="border-t-2 border-yellow-900 text-center">
											{order.orderId}
										</td>
									</tr>
									<tr>
										<th className="border-t-2 border-yellow-900 text-center">
											Vendedor
										</th>
										<td className="border-t-2 border-yellow-900 text-center">
											{order.sellerName}
										</td>
									</tr>
									<tr>
										<th className="border-t-2 border-yellow-900 text-center">
											Fecha/Hora
										</th>
										<td className="border-t-2 border-yellow-900 text-center">
											{format(new Date(order.date), "dd/MM/yyyy HH:mm:ss")}
										</td>
									</tr>
									<tr>
										<th className="border-t-2 border-yellow-900 text-center">
											Total
										</th>
										<td className="border-t-2 border-yellow-900 text-center">
											${getOrderTotal()}
										</td>
									</tr>
								</tbody>
							</table>
							<table className="border-separate text-left border-flame-700 my-5 w-full">
								<thead>
									<tr>
										<th
											colSpan={5}
											className="border-b-2 border-yellow-900 text-center"
										>
											Productos
										</th>
									</tr>
									<tr className="text-center text-blue-900">
										<th className="border-blue-900 font-light">Marca</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											Descripcion
										</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											Cantidad
										</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											Precio
										</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											SubTotal
										</th>
									</tr>
								</thead>
								<tbody>
									{order.detail.map((d) => (
										<tr className="text-gray-800" key={d.product._id}>
											<td className="border-t-2 border-yellow-600 font-light px-2">
												{d.product.brand}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{d.product.description}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{d.amount}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												$ {d.product.price}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												$ {+d.amount * +d.product.price}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</>
					)}
					<div className="flex justify-between">
						<Link to="/checkorders" className="btn btn-tertiary">
							Regresar
						</Link>
						{order && (
							<button
								className="btn btn-primary cursor-pointer font-bold"
								type="button"
								onClick={handleCancelOrder}
								disabled={isLoading || order.status === "canceled"}
							>
								Cancelar Orden
							</button>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default OrderDetail;
