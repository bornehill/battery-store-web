import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";

import storeService from "../../services/store.service";

const InventoryRequestView = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);
	const [requests, setRequests] = useState([]);

	useEffect(() => {
		if (requests.length) return;

		storeService
			.getInvRequest()
			.then(({ data }) => {
				if (data) setRequests(data.data);
			})
			.finally(() => setIsLoading(false))
			.catch((err) => {
				setErrorMessage(err.message);
			});
	}, [requests]);

	return (
		<React.Fragment>
			<Header />
			{isLoading && <LoadingBar />}
			{errorMessage && (
				<p className="mt-2 text-sm p-2 text-white bg-red-700">{errorMessage}</p>
			)}
			<main className="max-w-screen-xl mx-auto p-4 min-h-screen">
				<div className="w-full h-screen md:max-w-md md:rounded-sm md:mx-auto md:h-auto relative min-h-screen mb-10">
					<h1 className="text-4xl text-center">Autorización E/S</h1>
					<div className="m-3">
						<table className="border-separate text-left border-flame-700 mt-5 w-full">
							<thead>
								<tr>
									<th
										colSpan={5}
										className="border-b-2 border-yellow-900 text-center"
									>
										Movimientos
									</th>
								</tr>
								<tr className="text-center text-blue-900">
									<th className="border-blue-900 font-light">Ubicacion</th>
									<th className="border-blue-900 font-light">Tipo</th>
								</tr>
							</thead>
							<tbody>
								{requests.length > 0 &&
									requests.map((request) => (
										<tr className="text-gray-800" key={request._id}>
											<td className="border-t-2 border-yellow-600 font-light px-2">
												{request.location}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2">
												{request.typeMov === 1 ? "Entrada" : "Salida"}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 text-right">
												{request?.products && (
													<Link
														to={{
															pathname: `/authrequest/${request._id}`,
															query: { request },
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
					</div>
				</div>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default InventoryRequestView;
