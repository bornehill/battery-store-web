import React, { useReducer, useEffect, useState } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import LoadingBar from "../common/LoadingBar";
import InputControl from "../form-controls/InputControl";

import requestReducer from "../../reducers/request-reducer";
import storeService from "../../services/store.service";

import { CgCloseR } from "react-icons/cg";
import { BRAND_SUCCESS, GET_FAILURE } from "../../actions/request";

const BrandManagement = () => {
	const defaultValue = {
		name: "",
	};

	const [isLoading, setIsLoading] = useState(true);
	const [msgError, setMsgError] = useState(null);
	const [msgSuccess, setMsgSuccess] = useState(null);
	const [data, setData] = useState(defaultValue);
	const [{ brands }, dispatch] = useReducer(requestReducer, {
		brands: [],
	});

	useEffect(() => {
		if (brands?.length) return;

		storeService
			.getBrands()
			.then(({ data }) => {
				dispatch({
					brands: data.data,
					type: BRAND_SUCCESS,
				});
			})
			.finally(() => setIsLoading(false))
			.catch((err) => {
				console.log("error: ", err);
				dispatch({
					type: GET_FAILURE,
					error: err,
				});
			});
	}, []);

	function handleChange({ currentTarget: input }) {
		setMsgSuccess(null);
		const updateData = { ...data };
		updateData[input.name] = input.value;
		setData(updateData);
	}

	function handleAdd() {
		setMsgError(null);
		if (brands.find((b) => b.name === data.name)) {
			setMsgError("La marca ya existe!");
			return;
		}
		setIsLoading(true);

		storeService
			.addBrand({ name: data.name })
			.then(() => {
				dispatch({
					brands: [...brands, data],
					type: BRAND_SUCCESS,
				});

				setMsgSuccess("Marca agregada!");
			})
			.finally(() => {
				setIsLoading(false);
				setData(defaultValue);
			})
			.catch((err) => setMsgError(err));
	}

	return (
		<React.Fragment>
			<Header />
			{isLoading && <LoadingBar />}
			{msgError && (
				<p className="mt-2 text-sm p-2 text-white bg-red-700">{msgError}</p>
			)}
			{msgSuccess && (
				<p className="mt-2 flex justify-between text-sm p-2 text-white bg-teal-700">
					<span>{msgSuccess}</span>
					<CgCloseR
						className="cursor-pointer"
						onClick={() => setMsgSuccess(null)}
						title="Cerrar"
					/>
				</p>
			)}
			<main className="max-w-screen-xl h-screen mx-auto flex justify-center px-5">
				<div>
					<h1 className="text-3xl">Administrador de Marcas</h1>
					<div className="mb-4 md:flex md:items-end">
						<InputControl
							label="Nombre"
							name="name"
							value={data["name"]}
							onChange={handleChange}
						/>
						<button
							id="addBtn"
							name="addBtn"
							className="btn btn-primary ml-2 h-10 mb-2"
							type="button"
							onClick={handleAdd}
						>
							Agregar
						</button>
					</div>
					<table className="md:mx-auto w-11/12 mb-5">
						<thead>
							<tr className="bg-blue-900 text-white font-light ">
								<th className="px-4 py-2">Marcas</th>
							</tr>
						</thead>
						<tbody>
							{brands?.length === 0 ? (
								<tr>
									<td className="border-t-2 border-yellow-600">
										{isLoading ? "Cargando..." : "No hay marcas registradas!"}
									</td>
								</tr>
							) : (
								brands.map((brand) => (
									<tr key={brand._id}>
										<td className="border-t-2 border-yellow-600">
											{brand.name}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default BrandManagement;
