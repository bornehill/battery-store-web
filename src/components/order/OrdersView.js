import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";
import InputControl from "../form-controls/InputControl";
import SelectControl from "../form-controls/SelectControl";

import { mapListToDropdown } from "../../common/tools/mapEnum";

import storeService from "../../services/store.service";

const OrdersView = () => {
	const emptySeller = { _id: "0", firstName: "Seleccionar" };

	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);
	const [orderDate, setOrderDate] = useState(format(Date.now(), "yyyy-MM-dd"));
	const [sellers, setSellers] = useState([]);
	const [sellerSelected, setSellerSelected] = useState("0");
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		if (sellers.length) return;

		storeService
			.getEmployees()
			.then(({ data }) => {
				if (data) setSellers([emptySeller, ...data.data]);
			})
			.finally(() => setIsLoading(false))
			.catch((err) => {
				setErrorMessage(err.message);
			});
	}, [sellers]);

	const getOrders = (sellerId, start) => {
		setIsLoading(true);

		const sellerName = sellers.find((s) => s._id === sellerId).firstName;

		storeService
			.getOrdersBySeller(`seller=${sellerName}&start=${start}`)
			.then(({ data }) => {
				if (data) {
					const filtered = data.data.filter(
						(o) => o.status === "Open" || o.status === "canceled"
					);
					setOrders([...filtered]);
				}
			})
			.finally(() => setIsLoading(false))
			.catch((err) => {
				setErrorMessage(err.message);
			});
	};

	const handleSellerChange = (event) => {
		setErrorMessage("");
		setSellerSelected(event.target.value);
		getOrders(event.target.value, orderDate);
	};

	const handleOrderDate = (event) => {
		setOrderDate(event.target.value);
		setErrorMessage("");
		getOrders(sellerSelected, event.target.value);
	};

	return (
		<React.Fragment>
			<Header />
			{isLoading && <LoadingBar />}
			{errorMessage && (
				<p className="mt-2 text-sm p-2 text-white bg-red-700">{errorMessage}</p>
			)}
			<main className="max-w-screen-xl mx-auto p-4 min-h-screen">
				<div className="w-full h-screen md:max-w-md md:rounded-sm md:mx-auto md:h-auto relative min-h-screen mb-10">
					<h1 className="text-4xl text-center">Consulta de ordenes</h1>
					<div className="m-3">
						<SelectControl
							name="seller"
							label="Vendedor"
							value={sellerSelected}
							options={mapListToDropdown(sellers, "_id", "firstName")}
							onChange={handleSellerChange}
						/>
						<InputControl
							name="date"
							label="Fecha"
							type="date"
							value={orderDate}
							onChange={handleOrderDate}
						/>
						{orders.length > 0 && (
							<>
								<table className="border-separate text-left border-flame-700 mt-5 w-full">
									<thead>
										<tr>
											<th
												colSpan={5}
												className="border-b-2 border-yellow-900 text-center"
											>
												Ordenes
											</th>
										</tr>
										<tr className="text-center text-blue-900">
											<th className="border-blue-900 font-light">Orden</th>
											<th className="border-blue-900 font-light">Fecha/Hora</th>
										</tr>
									</thead>
									<tbody>
										{orders.map((order) => (
											<tr
												className={
													order.status === "canceled"
														? "text-red-600"
														: "text-gray-800"
												}
												key={order._id}
											>
												<td className="border-t-2 border-yellow-600 font-light px-2">
													{order.orderId}
												</td>
												<td className="border-t-2 border-yellow-600 font-light px-2">
													{order.date &&
														format(new Date(order.date), "dd/MM/yyyy HH:mm:ss")}
												</td>
												<td className="border-t-2 border-yellow-600 font-light px-2 text-right">
													{order?.detail && (
														<Link
															to={{
																pathname: `/orderdetail/${order.orderId}`,
																query: { order },
															}}
															className="btn btn-tertiary"
														>
															Ver
															<i className="fa fa-arrow-right ml-2"></i>
														</Link>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default OrdersView;
