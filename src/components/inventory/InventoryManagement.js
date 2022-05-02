import React, { useReducer, useEffect, useState } from "react";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";
import SelectControl from "../form-controls/SelectControl";
import InventoryMovForm from "./InventoryMovForm";

import { GET_FAILURE, PRODUCTS_LOADED } from "../../actions/request";
import { REQUEST_STATUS } from "../../actions/request-status";
import { mapListToDropdown } from "../../common/tools/mapEnum";

import storeService from "../../services/store.service";
import requestReducer from "../../reducers/request-reducer";

const InventoryManagement = () => {
	const emptyType = { value: "0", text: "Seleccionar tipo" };
	const emptyLocation = { _id: "0", name: "Seleccionar Ubicacion" };

	const emptyMov = {
		amount: 0,
		id: "",
	};

	const typesMov = [
		emptyType,
		{ value: "1", text: "Entrada" },
		{ value: "2", text: "Salida" },
	];
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState("");
	const [error, setError] = useState("");
	const [locationSelected, setLocationSelected] = useState("0");
	const [movSelected, setMovSelected] = useState(emptyMov);
	const [typeSelected, setTypeSelected] = useState("0");
	const [brands, setBrands] = useState([]);
	const [locations, setLocations] = useState([]);
	const [{ products }, dispatch] = useReducer(requestReducer, {
		status: REQUEST_STATUS.LOADING,
		products: [],
	});

	useEffect(() => {
		if (locations.length) return;

		storeService
			.getLocations()
			.then(({ data }) => {
				if (data) setLocations([emptyLocation, ...data.data]);
			})
			.finally(() => setIsLoading(false))
			.catch((err) => {
				dispatch({
					type: GET_FAILURE,
					error: err,
				});
			});
	}, [locations]);

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

	function handleLocationChange(event) {
		setError("");
		setLocationSelected(event.target.value);
	}

	function handleTypeMovChange(event) {
		setError("");
		setTypeSelected(event.target.value);
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
		if (locationSelected === "0" || typeSelected === "0" || !products.length) {
			setError("Seleccione Ubicacion, tipo y agregue los productos de E/S.");
			return;
		}

		const loc = locations.find((l) => l._id === locationSelected);
		setHasError("");
		setIsLoading(true);
		storeService
			.invrequest({
				products,
				location: loc.name,
				typeMov: typeSelected,
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
					<h1 className="text-4xl">Entradas/Salidas</h1>
				</div>
				<section className="flex">
					<div className="md:w-4/6 ">
						<div className="w-1/3">
							<SelectControl
								name="location"
								label="Ubicacion"
								value={locationSelected}
								options={mapListToDropdown(locations, "_id", "name")}
								onChange={handleLocationChange}
							/>
						</div>
						<div className="w-1/3">
							<SelectControl
								name="mov"
								label="Tipo"
								value={typeSelected}
								options={typesMov}
								onChange={handleTypeMovChange}
							/>
						</div>
						<div>
							<button
								disabled={isLoading}
								className="btn btn-primary"
								onClick={handleSubmit}
							>
								Aceptar
							</button>
							{error && <p className="text-sm text-red-700">{error}</p>}
						</div>
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

export default InventoryManagement;
