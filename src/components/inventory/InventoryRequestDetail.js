import React, { useState } from "react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";
import Modal from "../common/Modal";
import * as ModalTemplates from "../../common/types/ModalTemplates";

import storeService from "../../services/store.service";

const InventoryRequestDetail = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [request, setRequest] = useState(props.location.query?.request);
	const [modalSetting, setModalSetting] = useState({
		...ModalTemplates.ModalAuthRequest,
	});

	const closeModal = () => {
		setModalSetting({ ...modalSetting, show: false });
	};

	const handleAuthRequest = () => {
		setErrorMessage("");
		setModalSetting({
			...modalSetting,
			okFn: authRequest,
			cancelFn: closeModal,
			show: true,
		});
	};

	const authRequest = () => {
		setIsLoading(true);
		setModalSetting({ ...modalSetting, show: false });

		storeService
			.inputOutput(request)
			.then(({ data }) => {
				setRequest({ ...request, status: "canceled" });
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
					<h1 className="text-4xl text-center">Detalle de movimiento</h1>
					{request && (
						<>
							<table className="border-separate text-left border-flame-700 mt-5 w-full">
								<tbody>
									<tr>
										<th className="border-t-2 border-yellow-900 text-center">
											Ubicacion
										</th>
										<td className="border-t-2 border-yellow-900 text-center">
											{request.location}
										</td>
									</tr>
									<tr>
										<th className="border-t-2 border-yellow-900 text-center">
											Tipo de movimiento
										</th>
										<td className="border-t-2 border-yellow-900 text-center">
											{request.typeMov === 1 ? "Entrada" : "Salida"}
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
									</tr>
								</thead>
								<tbody>
									{request.products.map((p) => (
										<tr className="text-gray-800" key={p.product._id}>
											<td className="border-t-2 border-yellow-600 font-light px-2">
												{p.product.brand}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{p.product.description}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{p.amount}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</>
					)}
					<div className="flex justify-between">
						<Link to="/invrequest" className="btn btn-tertiary">
							Regresar
						</Link>
						{request && (
							<button
								className="btn btn-primary cursor-pointer font-bold"
								type="button"
								onClick={handleAuthRequest}
								disabled={isLoading || request.status === "canceled"}
							>
								Autorizar
							</button>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default InventoryRequestDetail;
