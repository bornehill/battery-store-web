import React, { useState } from "react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";
import { PaymentMethod } from "../../common/types/PaymentMethod";
import { NoteStatus } from "../../common/types/NoteStatus";
import Modal from "../common/Modal";
import * as ModalTemplates from "../../common/types/ModalTemplates";

import storeService from "../../services/store.service";

const CreditPayment = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [note, setNote] = useState(props.location.query?.note);
	const [modalSetting, setModalSetting] = useState({
		...ModalTemplates.ModalCreditPayment,
	});

	const getNoteTotal = (order, discount) => {
		const subTotal = order.detail.reduce(
			(previousValue, p) => previousValue + +p.amount * +p.product.price,
			0
		);

		return discount ? subTotal - discount : subTotal;
	};

	const closeModal = () => {
		setModalSetting({ ...modalSetting, show: false });
	};

	const handlePayCredit = () => {
		setErrorMessage("");
		setModalSetting({
			...modalSetting,
			okFn: payNote,
			cancelFn: closeModal,
			show: true,
		});
	};

	const payNote = () => {
		setIsLoading(true);
		setModalSetting({ ...modalSetting, show: false });

		storeService
			.payCredit({
				noteId: note.noteId,
				noteNo: note.noteNo,
				amount: getNoteTotal(note.order, note.discount),
			})
			.then(({ data }) => {
				setNote({ ...note, status: NoteStatus.payed });
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
					<h1 className="text-4xl text-center">Detalle de nota</h1>
					{note && (
						<>
							<table className="border-separate text-left border-flame-700 mt-5 w-full">
								<tbody>
									<tr>
										<th className="border-t-2 border-yellow-900 text-center">
											Nota
										</th>
										<td className="border-t-2 border-yellow-900 text-center">
											{note.noteNo ?? note.noteId}
										</td>
									</tr>
									<tr>
										<th className="border-t-2 border-yellow-900 text-center">
											Cliente
										</th>
										<td className="border-t-2 border-yellow-900 text-center">
											{note.clientName}
										</td>
									</tr>
									<tr>
										<th className="border-t-2 border-yellow-900 text-center">
											Tipo Pago
										</th>
										<td className="border-t-2 border-yellow-900 text-center">
											{PaymentMethod[note.payment]}
										</td>
									</tr>
									<tr>
										<th className="border-t-2 border-yellow-900 text-center">
											Fecha/Hora
										</th>
										<td className="border-t-2 border-yellow-900 text-center">
											{format(new Date(note.date), "dd/MM/yyyy HH:mm:ss")}
										</td>
									</tr>
									<tr>
										<th className="border-t-2 border-yellow-900 text-center">
											Descuento
										</th>
										<td className="border-t-2 border-yellow-900 text-center">
											${note.discount ?? 0}
										</td>
									</tr>
									<tr>
										<th className="border-t-2 border-yellow-900 text-center">
											Total
										</th>
										<td className="border-t-2 border-yellow-900 text-center">
											${getNoteTotal(note.order, note.discount)}
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
										<th className="border-blue-900 font-light">Descripcion</th>
										<th className="border-blue-900 font-light">Cantidad</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											Precio
										</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											SubTotal
										</th>
									</tr>
								</thead>
								<tbody>
									{note.order.detail.map((d) => (
										<tr className="text-gray-800" key={d.product._id}>
											<td className="border-t-2 border-yellow-600 font-light px-2">
												{d.product.brand}
											</td>
											<td className="border-t-2 border-yellow-600">
												{d.product.description}
											</td>
											<td className="border-t-2 border-yellow-600">
												{d.amount}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												$ {d.product.price}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												$ {+d.amount * +d.product.price}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</>
					)}
					<div className="flex justify-between">
						<Link to="/pay/credit" className="btn btn-tertiary">
							Regresar
						</Link>
						{note && (
							<button
								className="btn btn-primary cursor-pointer font-bold"
								type="button"
								onClick={handlePayCredit}
								disabled={isLoading || note.status === NoteStatus.payed}
							>
								Pagar credito
							</button>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default CreditPayment;
