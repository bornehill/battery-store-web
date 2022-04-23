import React, { useState, useEffect } from "react";
import CashForm from "./CashForm";
import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";
import SelectControl from "../form-controls/SelectControl";

import { mapListToDropdown } from "../../common/tools/mapEnum";

import storeService from "../../services/store.service";

const CashView = () => {
	const emptyOrder = { _id: "0", orderId: "" };

	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [error, setError] = useState("");
	const [total, setTotal] = useState("0");
	const [products, setProducts] = useState([]);
	const [orders, setOrders] = useState([]);
	const [orderSelected, setOrderSelected] = useState("0");

	useEffect(() => {
		if (orders.length) return;

		loadOrders();
	}, [orders]);

	const loadOrders = () => {
		setIsLoading(true);

		storeService
			.getOrders("status=Open")
			.then(({ data }) => {
				if (data) setOrders([emptyOrder, ...data.data]);
			})
			.finally(() => setIsLoading(false))
			.catch((err) => {
				setErrorMessage(err);
			});
	};

	const handleSuccess = () => {
		loadOrders();
		setOrderSelected("0");
		setProducts([]);
		setTotal("0");
	};

	const handleError = (error) => {
		setErrorMessage(error);
	};

	const handleLoading = (loading) => {
		setIsLoading(loading);

		if (isLoading) {
			setErrorMessage(null);
		}
	};

	function handleOrderChange(event) {
		setErrorMessage("");
		const order = orders.find((o) => o.orderId === +event.target.value);
		const tot = order.detail.reduce(
			(previousValue, p) => previousValue + +p.amount * +p.product.price,
			0
		);
		setTotal(tot);
		setProducts(order.detail);
		setOrderSelected(event.target.value);
	}

	return (
		<React.Fragment>
			<Header />
			{isLoading && <LoadingBar />}
			{errorMessage && (
				<p className="mt-2 text-sm p-2 text-white bg-red-700">{errorMessage}</p>
			)}
			<main className="max-w-screen-xl mx-auto p-4 min-h-screen">
				<div className="flex items-center justify-between p-4">
					<h1 className="text-4xl">Caja</h1>
				</div>
				<section className="flex">
					<div className="md:w-4/6 ">
						<div className="w-1/3">
							<SelectControl
								name="location"
								label="Order"
								value={orderSelected}
								options={mapListToDropdown(orders, "orderId", "orderId")}
								onChange={handleOrderChange}
							/>
							<label>
								Total: <span className="font-light text-2xl">${total}</span>
							</label>
						</div>
						{products && (
							<table className="border-separate text-left border-flame-700 mt-5 md:w-2/3">
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
									{products.map((mov) => (
										<tr className="text-gray-800" key={mov.product._id}>
											<td className="border-t-2 border-yellow-600 font-light px-2">
												{mov.product.brand}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{mov.product.description}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{mov.amount}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												$ {mov.product.price}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												$ {+mov.amount * +mov.product.price}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
					<div className="w-full md:w-2/6">
						<CashForm
							onSuccess={handleSuccess}
							onError={handleError}
							onLoading={handleLoading}
							orderId={orderSelected}
						/>
					</div>
				</section>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default CashView;
