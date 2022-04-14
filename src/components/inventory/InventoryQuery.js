import React, { useState, useEffect } from "react";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";
import SelectControl from "../form-controls/SelectControl";

import { mapListToDropdown } from "../../common/tools/mapEnum";

import storeService from "../../services/store.service";

const InventoryQuery = () => {
	const emptyLocation = { _id: "0", name: "Seleccionar Ubicacion" };

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [locationSelected, setLocationSelected] = useState("0");
	const [locations, setLocations] = useState([]);
	const [inventory, setInventory] = useState([]);

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

	function handleLocationChange(event) {
		setError("");
		setLocationSelected(event.target.value);

		setIsLoading(true);
		const loc = locations.find((l) => l._id === event.target.value);
		storeService
			.getInventory(loc.name)
			.then(({ data }) => {
				if (data.data.length) {
					setInventory(data.data);
				}
				setIsLoading(false);
			})
			.catch((err) => {
				setError(err);
			});
	}

	return (
		<React.Fragment>
			<Header />
			<main>
				<div className="w-full h-screen md:max-w-md md:rounded-sm md:mx-auto md:h-auto relative min-h-screen">
					{isLoading && <LoadingBar />}
					<div className="p-10">
						<h1 className="text-4xl">Consulta de inventario</h1>
						<div className="m-3">
							<SelectControl
								name="location"
								label="Ubicacion"
								value={locationSelected}
								options={mapListToDropdown(locations, "_id", "name")}
								onChange={handleLocationChange}
							/>
							{inventory && (
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
											<th className="border-blue-900 font-light hidden md:table-cell">
												Descripcion
											</th>
											<th className="border-blue-900 font-light hidden md:table-cell">
												Grupo
											</th>
											<th className="border-blue-900 font-light hidden md:table-cell">
												Existencia
											</th>
										</tr>
									</thead>
									<tbody>
										{inventory.map((mov) => (
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
					</div>
				</div>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default InventoryQuery;