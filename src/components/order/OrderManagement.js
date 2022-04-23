import React, { useReducer, useEffect, useState } from "react";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";
import SelectControl from "../form-controls/SelectControl";
import InventoryMovForm from "../inventory/InventoryMovForm";

import { GET_FAILURE, PRODUCTS_LOADED } from "../../actions/request";
import { REQUEST_STATUS } from "../../actions/request-status";
import { mapListToDropdown } from "../../common/tools/mapEnum";

import storeService from "../../services/store.service";
import requestReducer from "../../reducers/request-reducer";

const OrderManagement = () => {
	const emptySeller = { _id: "0", firstName: "Seleccionar" };

	const emptyMov = {
		amount: 0,
		id: "",
	};

	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState("");
	const [error, setError] = useState("");
	const [sellerSelected, setSellerSelected] = useState("0");
	const [movSelected, setMovSelected] = useState(emptyMov);
	const [brands, setBrands] = useState([]);
	const [sellers, setSellers] = useState([]);
	const [{ products }, dispatch] = useReducer(requestReducer, {
		status: REQUEST_STATUS.LOADING,
		products: [],
	});

	useEffect(() => {
		if (sellers.length) return;

		storeService
			.getEmployees()
			.then(({ data }) => {
				if (data) setSellers([emptySeller, ...data.data]);
			})
			.finally(() => setIsLoading(false))
			.catch((err) => {
				dispatch({
					type: GET_FAILURE,
					error: err,
				});
			});
	}, [sellers]);

	useEffect(() => {
		if (brands.length) return;

		storeService
			.getBrands()
			.then(({ data }) => {
				if (data) setBrands(data.data);
			})
			.catch((err) => {
				dispatch({
					type: GET_FAILURE,
					error: err,
				});
			});
	}, [brands]);

	function handleSellerChange(event) {
		setError("");
		setSellerSelected(event.target.value);
	}

	function handleSuccess(mov) {
		setError("");
		setHasError("");
		if (products.find((p) => p.product.id === mov.product.id)) {
			setHasError("El producto ya esta en la lista.");
			return;
		}

		dispatch({ products: [...products, mov], type: PRODUCTS_LOADED });
		setMovSelected(emptyMov);
	}

	const handleLoading = (loading) => {
		setIsLoading(loading);

		if (isLoading) {
			setHasError("");
		}
	};

	function handleSubmit(e) {
		e.preventDefault();

		setError("");
		if (sellerSelected === "0" || !products.length) {
			setError("Seleccione un vendedor y agregue los productos de la orden.");
			return;
		}

		const seller = sellers.find((l) => l._id === sellerSelected);
		setHasError("");
		setIsLoading(true);
		storeService
			.addOrder({
				sellerName: seller.firstName,
				detail: products,
				status: "Open",
			})
			.then((resp) => {
				if (!resp === "Success") {
					setHasError(
						"Ha ocurrido un error al realizar el movimiento de inventario. Por favor intentelo de nuevo."
					);
					return;
				}
				dispatch({ products: [], type: PRODUCTS_LOADED });
				setIsLoading(false);
			})
			.catch(() =>
				setHasError(
					"Ha ocurrido un error al realizar el movimiento de inventario. Por favor intentelo de nuevo."
				)
			);
	}

	return (
		<React.Fragment>
			<Header />
			{isLoading && <LoadingBar />}
			{hasError && (
				<p className="mt-2 text-sm p-2 text-white bg-red-700">{hasError}</p>
			)}
			<main className="max-w-screen-xl mx-auto p-4 min-h-screen">
				<div className="flex items-center justify-between p-4">
					<h1 className="text-4xl">Orden</h1>
				</div>
				<section className="flex">
					<div className="md:w-4/6 ">
						<div className="w-1/3">
							<SelectControl
								name="seller"
								label="Vendedor"
								value={sellerSelected}
								options={mapListToDropdown(sellers, "_id", "firstName")}
								onChange={handleSellerChange}
							/>
						</div>
						<div>
							<button
								disabled={isLoading}
								className="btn btn-primary"
								onClick={handleSubmit}
							>
								Agregar
							</button>
							{error && <p className="text-sm text-red-700">{error}</p>}
						</div>
						<label></label>
						{products && (
							<table className="border-separate text-left border-flame-700 mt-5 md:w-2/3">
								<thead>
									<tr>
										<th
											colSpan={4}
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
											Grupo
										</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											Cantidad
										</th>
									</tr>
								</thead>
								<tbody>
									{products.map((mov) => (
										<tr className="text-gray-800" key={mov.product.id}>
											<td className="border-t-2 border-yellow-600 font-light px-2">
												{mov.product.brand}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{mov.product.description}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{mov.product.group}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{mov.amount}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
					<div className="w-full md:w-2/6">
						<InventoryMovForm
							onSuccess={handleSuccess}
							onLoading={handleLoading}
							productSelected={movSelected}
							brands={[{ name: "Seleccionar" }, ...brands]}
						/>
					</div>
				</section>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default OrderManagement;
