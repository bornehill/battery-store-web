import React, { useReducer, useEffect, useState } from "react";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";
import SelectControl from "../form-controls/SelectControl";
import ProductForm from "./ProductForm";

import { GET_FAILURE, PRODUCTS_LOADED } from "../../actions/request";
import { REQUEST_STATUS } from "../../actions/request-status";
import { mapListToDropdown } from "../../common/tools/mapEnum";
import { IconContext } from "react-icons";
import { MdEdit } from "react-icons/md";

import storeService from "../../services/store.service";
import requestReducer from "../../reducers/request-reducer";

const ProductManagement = () => {
	const emptyProduct = {
		brand: "",
		description: "",
		group: "",
		amp: "",
		price: 0,
	};

	const [productSelected, setProductSelected] = useState(emptyProduct);
	const [isLoading, setIsLoading] = useState(false);
	const [brandSelected, setBrandSelected] = useState("Casco");
	const [brands, setBrands] = useState([]);
	const [hasAddProductFailed, setHasAddProductFailed] = useState(false);
	const [{ products }, dispatch] = useReducer(requestReducer, {
		status: REQUEST_STATUS.LOADING,
		products: [],
	});

	useEffect(() => {
		storeService
			.getBrands()
			.then(({ data }) => {
				if (data) setBrands(data.data);
			})
			.catch((err) => {
				console.log("error: ", err);
				dispatch({
					type: GET_FAILURE,
					error: err,
				});
			});
	}, [brands]);

	useEffect(() => {
		loadProducts(brandSelected);
	}, []);

	function loadProducts(brand) {
		setIsLoading(true);
		storeService
			.getProducts(`brand=${brand}`)
			.then(({ data }) => {
				if (data) {
					data.data.sort(sortByDescription).sort(sortByGroup);
					dispatch({
						products: [...data.data],
						type: PRODUCTS_LOADED,
					});
				}
			})
			.finally(() => {
				setIsLoading(false);
				setProductSelected(emptyProduct);
			})
			.catch((err) => {
				console.log("error: ", err);
				dispatch({
					type: GET_FAILURE,
					error: err,
				});
			});
	}

	function handleGroupChange(newBrand) {
		loadProducts(newBrand.target.value);
		setBrandSelected(newBrand.target.value);
	}

	function handleSuccess() {
		loadProducts(brandSelected);
		setProductSelected({ ...emptyProduct, id: "1" });
	}

	const handleError = () => {
		setHasAddProductFailed(true);
	};

	const handleLoading = (loading) => {
		setIsLoading(loading);

		if (isLoading) {
			setHasAddProductFailed(false);
		}
	};

	function handleSelectItem(product) {
		setProductSelected(product);
	}

	function sortByDescription(a, b) {
		return a.description.localeCompare(b.description);
	}

	function sortByGroup(a, b) {
		return a.group.localeCompare(b.group);
	}

	return (
		<React.Fragment>
			<Header />
			{isLoading && <LoadingBar />}
			{hasAddProductFailed && (
				<p className="mt-2 text-sm p-2 text-white bg-red-700">
					Ha ocurrido un error al agregar el producto. Por favor intentelo de
					nuevo.
				</p>
			)}
			<main className="max-w-screen-xl mx-auto p-4 min-h-screen">
				<div className="flex items-center justify-between p-4">
					<h1 className="text-4xl">Administrador de productos</h1>
				</div>
				<section className="flex">
					<div className="md:w-4/6 ">
						<div className="w-1/3">
							<SelectControl
								name="brand"
								label="Marca"
								value={brandSelected}
								options={mapListToDropdown(brands, "name", "name")}
								onChange={handleGroupChange}
							/>
						</div>
						{products && products.length ? (
							<table className="border-separate text-left border-flame-700">
								<thead>
									<tr className="text-center text-blue-900">
										<th className="border-blue-900 font-light">Marca</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											Descripcion
										</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											Grupo
										</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											Ampers
										</th>
										<th className="border-blue-900 font-light">Precio</th>
										<th className="border-blue-900 font-light">Accion</th>
									</tr>
								</thead>
								<tbody>
									{products.map((product) => (
										<tr className="text-gray-800" key={product.id}>
											<td className="border-t-2 border-yellow-600 font-light px-2">
												{product.brand}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{product.description}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{product.group}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{product.amp}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2">
												$ {product.price}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 flex">
												<IconContext.Provider
													value={{
														className: "m-3 text-flame-700",
														size: "20px",
													}}
												>
													<MdEdit
														key={"edit_" + product.id}
														className="cursor-pointer"
														onClick={() => handleSelectItem(product)}
														title="Actualizar producto"
													/>
												</IconContext.Provider>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<div className="text-2xl text-flame-700">
								{isLoading ? "Cargando..." : "No hay productos para mostrar."}
							</div>
						)}
					</div>
					<div className="w-full md:w-2/6">
						<ProductForm
							onSuccess={handleSuccess}
							onError={handleError}
							onLoading={handleLoading}
							productSelected={productSelected}
							brands={brands}
						/>
					</div>
				</section>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default ProductManagement;
