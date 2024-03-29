import React from "react";
import Joi from "joi";

import Form from "../form-controls/Form";
import Modal from "../common/Modal";
import * as ModalTemplates from "../../common/types/ModalTemplates";

import storeService from "../../services/store.service";

import { PaymentMethod } from "../../common/types/PaymentMethod";
import { NoteStatus } from "../../common/types/NoteStatus";
import { mapEnumToDropdown } from "../../common/tools/mapEnum";

class CashForm extends Form {
	emptyErrors = {
		clientName: "",
		payment: "",
		authorizationId: "",
		noteNo: "",
	};

	state = {
		data: { clientName: "", payment: "", authorizationId: "", noteNo: "" },
		errors: this.emptyErrors,
		isLoading: false,
		isShowModal: false,
		orderId: "0",
	};

	formSchema = {
		clientName: Joi.string()
			.min(3)
			.message("Se requiere nombre del cliente (min: 3 caracteres)"),
		payment: Joi.string(),
		authorizationId: Joi.any(),
		noteNo: Joi.any(),
	};

	modalSetting = { ...ModalTemplates.ModalSaveNote };

	closeModal = () => {
		this.modalSetting.show = false;
		this.setState({ isShowModal: false });
	};

	addNote = () => {
		let status = NoteStatus.payed;

		this.setState({ isLoading: true });
		this.props.onLoading(true);
		window.scrollTo(0, 0);

		switch (PaymentMethod[this.state.data.payment]) {
			case PaymentMethod.credit:
				status = NoteStatus.credit;
				break;
			case PaymentMethod.helmet:
				status = NoteStatus.preauth;
				break;
		}

		const addNote = {
			note: {
				...this.state.data,
				orderId: this.props.orderId,
				status,
				discount: this.props.discount,
			},
			location: "San felipe acumuladores",
		};

		storeService
			.addNote(addNote)
			.then(() => {
				this.props.onSuccess("Venta terminada!");
				this.setState({
					isLoading: false,
					isShowModal: false,
				});
			})
			.finally(() => {
				this.modalSetting.show = false;
				this.props.onLoading(false);
			})
			.catch((err) => this.props.onError(err?.message ?? "Request error"));
	};

	doSubmit = () => {
		this.modalSetting.okFn = this.addNote;
		this.modalSetting.cancelFn = this.closeModal;
		this.modalSetting.show = true;
		this.setState({ isShowModal: true });
	};

	componentDidUpdate() {
		if (this.props.orderId !== this.state.orderId) {
			this.setState({
				data: this.emptyErrors,
				orderId: this.props.orderId,
				errors: this.emptyErrors,
			});
		}
	}

	render() {
		return (
			<>
				<Modal {...this.modalSetting} />
				<div className="p-5 bg-gray-300">
					<form
						key={this.state.orderId}
						onSubmit={this.handleSubmit}
						noValidate
						className="bt-3"
					>
						{this.renderInput("clientName", "Cliente", "clientName")}
						{this.renderDropDown(
							"payment",
							"Pago",
							mapEnumToDropdown(PaymentMethod)
						)}
						{this.renderInput(
							"authorizationId",
							"Autorizacion/No cheque",
							"authorizationId"
						)}
						{this.renderInput("noteNo", "No. nota", "noteNo")}
						<div className="flex justify-center mt-8 mb-5">
							{this.renderSubmit("Terminar")}
						</div>
					</form>
				</div>
			</>
		);
	}
}

export default CashForm;
