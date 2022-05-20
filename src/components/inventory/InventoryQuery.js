import React, { useState, useEffect } from "react";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Paginate from "../common/Paginate";
import SelectControl from "../form-controls/SelectControl";

import { mapListToDropdown } from "../../common/tools/mapEnum";

import storeService from "../../services/store.service";

const InventoryQuery = () => {
	const emptyLocation = { _id: "0", name: "Seleccionar Ubicacion" };

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [locationSelected, setLocationSelected] = useState("0");
	const [brandSelected, setBrandSelected] = useState("0");
	const [locations, setLocations] = useState([]);
	const [inventory, setInventory] = useState([]);
	const [inventoryView, setInventoryView] = useState([]);
	const [inventoryPage, setInventoryPage] = useState([]);
	const [brands, setBrands] = useState([]);
	const [page, setPage] = useState(1);
	const [totalGroups, setTotalGroups] = useState([]);

	useEffect(() => {
		if (locations.length) return;

		storeService
			.getLocations()
			.then(({ data }) => {
				if (data) setLocations([emptyLocation, ...data.data]);
			})
			.finally(() => setIsLoading(false))
			.catch((err) => setError(err));
	}, [locations]);

	useEffect(() => {
		if (brands.length) return;

		storeService
			.getBrands()
			.then(({ data }) => {
				if (data) setBrands(data.data);
			})
			.catch((err) => {
				setError(err);
			});
	}, [brands]);

	function handleLocationChange(event) {
		setLocationSelected(event.target.value);
		cleanData();
		setIsLoading(true);
		const loc = locations.find((l) => l._id === event.target.value);
		storeService
			.getInventory(loc.name)
			.then(({ data }) => {
				if (data.data.length) {
					const view = data.data;
					popupData(view);
				}
				setIsLoading(false);
			})
			.catch((err) => {
				setError(err);
			});
	}

	const cleanData = () => {
		setError("");
		setBrandSelected("0");
		setInventory([]);
		setInventoryView([]);
		setInventoryPage([]);
		setTotalGroups([]);
		setPage(1);
	};

	const popupData = (view) => {
		const totals = view.reduce((t, n) => {
			const group = n.product.group;
			const entry = t.findIndex((e) => e.group === group);
			if (entry === -1) {
				t.push({ group, amount: n.amount });
			} else {
				t[entry].amount = t[entry].amount + n.amount;
			}
			return t;
		}, []);

		setTotalGroups(totals);
		setInventory(view);
		setInventoryView(view);
		setInventoryPage(view.slice(0, 10));
	};

	function handleBrandChange(event) {
		setIsLoading(true);
		setError("");
		setBrandSelected(event.target.value);
		setPage(1);
		const view = inventory.filter(
			(i) => i.product.brand === event.target.value
		);
		setInventoryView(view);
		setInventoryPage(view.slice(0, 10));
		setIsLoading(false);
	}

	const handlePaginate = (elements) => {
		setInventoryPage(elements);
	};

	return (
		<React.Fragment>
			<Header />
			<main>
				<div className="w-full h-screen md:max-w-xl md:rounded-sm md:mx-auto md:h-auto relative min-h-screen mb-10">
					{isLoading && <LoadingBar />}
					<div className="p-10">
						<h1 className="md:text-center text-4xl">Consulta de inventario</h1>
						<div className="m-3">
							<SelectControl
								name="location"
								label="Ubicacion"
								value={locationSelected}
								options={mapListToDropdown(locations, "_id", "name")}
								onChange={handleLocationChange}
							/>
							<SelectControl
								name="brand"
								label="Marca"
								value={brandSelected}
								options={mapListToDropdown(
									[{ name: "Seleccionar" }, ...brands],
									"name",
									"name"
								)}
								onChange={handleBrandChange}
							/>
							{inventoryView && (
								<>
									{totalGroups.length > 0 && (
										<table className="border-separate text-left border-flame-700 mt-5 w-full">
											<thead>
												<tr>
													<th></th>
													{totalGroups.map((g) => (
														<th
															className="border-b-2 border-yellow-900 text-center"
															key={"name_" + g.group}
														>
															{g.group}
														</th>
													))}
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>Total</td>
													{totalGroups.map((g) => (
														<td
															className="text-center font-light"
															key={"amount_" + g.group}
														>
															{g.amount}
														</td>
													))}
												</tr>
											</tbody>
										</table>
									)}
									<table className="border-separate text-left border-flame-700 mt-5 w-full">
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
												<th className="border-blue-900 font-light">
													Descripcion
												</th>
												<th className="border-blue-900 font-light hidden md:table-cell">
													Grupo
												</th>
												<th className="border-blue-900 font-light">
													Existencia
												</th>
											</tr>
										</thead>
										<tbody>
											{inventoryPage.map((mov) => (
												<tr className="text-gray-800" key={mov.product._id}>
													<td className="border-t-2 border-yellow-600 font-light px-2">
														{mov.product.brand}
													</td>
													<td className="border-t-2 border-yellow-600 font-light px-2">
														{mov.product.description}
													</td>
													<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
														{mov.product.group}
													</td>
													<td className="border-t-2 border-yellow-600 font-light px-2">
														{mov.amount}
													</td>
												</tr>
											))}
										</tbody>
									</table>
									{inventoryView.length > 0 && (
										<Paginate
											page={page}
											setPage={setPage}
											elements={inventoryView}
											elementsByPage={10}
											dispatchUpdateView={handlePaginate}
										/>
									)}
								</>
							)}
						</div>
					</div>
				</div>
			</main>
		</React.Fragment>
	);
};

export default InventoryQuery;
