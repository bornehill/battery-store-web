import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import format from "date-fns/format";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";
import InputControl from "../form-controls/InputControl";
import Paginate from "../common/Paginate";
import { PaymentMethod } from "../../common/types/PaymentMethod";
import { NoteStatus } from "../../common/types/NoteStatus";

import storeService from "../../services/store.service";

const CutoffView = () => {
	const emptyNote = { _id: "0" };

	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const [dateCutoff, setDateCutoff] = useState(
		format(Date.now(), "yyyy-MM-dd")
	);
	const [notes, setNotes] = useState([]);
	const [totals, setTotals] = useState([]);
	const [notesView, setNotesView] = useState([]);
	const [payments, setPayments] = useState([]);
	const [page, setPage] = useState(1);

	useEffect(() => {
		if (notes.length) return;

		loadNotes(dateCutoff);
	}, [notes]);

	useEffect(() => {
		if (payments.length) return;

		loadPayments(dateCutoff);
	}, [notes]);

	const loadNotes = (start) => {
		setIsLoading(true);

		storeService
			.getNotes(`start=${start}`)
			.then(({ data }) => {
				if (data?.data?.length) handleNotes([...data.data]);
			})
			.finally(() => setIsLoading(false))
			.catch((err) => {
				setErrorMessage(err.message);
			});
	};

	const loadPayments = (start) => {
		setIsLoading(true);

		storeService
			.getPayments(`start=${start}`)
			.then(({ data }) => {
				if (data?.data?.length) setPayments([...data.data]);
			})
			.finally(() => setIsLoading(false))
			.catch((err) => {
				setErrorMessage(err.message);
			});
	};

	const handleNotes = (notes) => {
		setNotes(notes);
		setNotesView(notes.slice(0, 10));
		setPage(1);
		const totals = notes
			.filter(
				(n) =>
					n.status === NoteStatus.payed || n.status === NoteStatus.precanceled
			)
			.reduce((t, n) => {
				const payment = n.payment;
				const entry = t.findIndex((e) => e.payment === payment);
				if (entry === -1) {
					const notes = [{ ...n }];
					t.push({ payment, notes });
				} else {
					t[entry].notes.push(n);
				}
				return t;
			}, []);

		for (let pos = 0; pos < totals.length; pos++) {
			const subtotal = totals[pos].notes.reduce((t, n) => {
				return getNoteTotal(n.order, n.discount) + t;
			}, 0);
			totals[pos].total = subtotal;
		}

		setTotals(totals);
	};

	const handlePaginate = (elements) => {
		setNotesView(elements);
	};

	const getNoteTotal = (order, discount) => {
		const subTotal = order.detail.reduce(
			(previousValue, p) => previousValue + +p.amount * +p.product.price,
			0
		);

		return discount ? subTotal - discount : subTotal;
	};

	const getTotalPayments = () => {
		return payments.reduce((previousValue, p) => previousValue + +p.amount, 0);
	};

	const handleDateCutoff = (event) => {
		setDateCutoff(event.target.value);
		setErrorMessage("");
		setTotals([]);
		setNotes([emptyNote]);
		setNotesView([]);
		loadNotes(event.target.value);
		loadPayments(event.target.value);
	};

	return (
		<React.Fragment>
			<Header />
			{isLoading && <LoadingBar />}
			{errorMessage && (
				<p className="mt-2 text-sm p-2 text-white bg-red-700">{errorMessage}</p>
			)}
			<main className="max-w-screen-xl mx-auto p-4 min-h-screen">
				<div className="w-full h-screen md:max-w-md md:rounded-sm md:mx-auto md:h-auto relative min-h-screen mb-10">
					<h1 className="text-4xl text-center">Corte de Caja</h1>
					<div className="m-3">
						<InputControl
							name="date"
							label="Fecha"
							type="date"
							value={dateCutoff}
							onChange={handleDateCutoff}
						/>
						{notes && (
							<>
								<table className="border-separate text-left border-flame-700 mt-5 w-full">
									<thead>
										<tr>
											<th
												colSpan={2}
												className="border-b-2 border-yellow-900 text-center"
											>
												Totales
											</th>
										</tr>
										<tr className="text-center text-blue-900">
											<th className="border-blue-900 font-light">
												Tipo de pago
											</th>
											<th className="border-blue-900 font-light">Total</th>
										</tr>
									</thead>
									<tbody>
										{totals.length > 0 &&
											totals.map((total) => (
												<tr className="text-gray-800" key={total.payment}>
													<td className="border-t-2 border-yellow-600 font-light px-2">
														{PaymentMethod[total.payment]}
													</td>
													<td className="border-t-2 border-yellow-600 font-light px-2 text-right">
														$ {total.total}
													</td>
												</tr>
											))}
										{payments.length > 0 && (
											<tr className="text-gray-800" key={"abonos"}>
												<td className="border-t-2 border-yellow-600 font-light px-2">
													Abonos
												</td>
												<td className="border-t-2 border-yellow-600 font-light px-2 text-right">
													$ {getTotalPayments()}
												</td>
											</tr>
										)}
									</tbody>
								</table>
								<table className="border-separate text-left border-flame-700 mt-5 w-full">
									<thead>
										<tr>
											<th
												colSpan={5}
												className="border-b-2 border-yellow-900 text-center"
											>
												Notas
											</th>
										</tr>
										<tr className="text-center text-blue-900">
											<th className="border-blue-900 font-light">Nota</th>
											<th className="border-blue-900 font-light hidden md:table-cell">
												Tipo Pago
											</th>
											<th className="border-blue-900 font-light">Fecha/Hora</th>
											<th className="border-blue-900 font-light">Total</th>
											<th className="border-blue-900 font-light">Detalle</th>
										</tr>
									</thead>
									<tbody>
										{notesView.map((note) => (
											<tr
												className={
													note.status === NoteStatus.canceled ||
													note.status === NoteStatus.preauth
														? "text-red-600"
														: "text-gray-800"
												}
												key={note._id}
											>
												<td className="border-t-2 border-yellow-600 font-light px-2">
													{note.noteNo ?? note.noteId}
												</td>
												<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
													{note.payment && PaymentMethod[note.payment]}
												</td>
												<td className="border-t-2 border-yellow-600 font-light px-2">
													{note.date &&
														format(new Date(note.date), "dd/MM/yyyy HH:mm:ss")}
												</td>
												<td className="border-t-2 border-yellow-600 font-light px-2 text-right">
													{note.order?.detail &&
														`$ ${getNoteTotal(note.order, note.discount)}`}
												</td>
												<td className="border-t-2 border-yellow-600 font-light px-2 text-right">
													{note.order?.detail && (
														<Link
															to={{
																pathname: `/note/${note.noteId}`,
																query: { note, action: "payed" },
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
								{notes.length > 0 && (
									<Paginate
										page={page}
										setPage={setPage}
										elements={notes}
										elementsByPage={10}
										dispatchUpdateView={handlePaginate}
									/>
								)}
							</>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default CutoffView;
