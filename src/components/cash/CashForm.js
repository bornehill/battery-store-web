import React from "react";
import Joi from "joi";

import Form from "../form-controls/Form";
import Modal from "../common/Modal";
import * as ModalTemplates from "../../common/types/ModalTemplates";

class CashForm extends Form {
	state = {
		data: { sellerName: "", clientName: "" },
		errors: { sellerName: "", clientName: "" },
		isLoading: false,
		isShowModal: false,
	};

	formSchema = {
		sellerName: Joi.string()
			.min(3)
			.message("Se requiere nombre del vendedor (min: 3 caracteres)"),
		clientName: Joi.string()
			.min(3)
			.message("Se requiere nombre del cliente (min: 3 caracteres)"),
	};

	modalSetting = { ...ModalTemplates.ModalLogin };

	closeModal = () => {
		this.modalSetting.show = false;
		this.setState({ isShowModal: false });
	};

	openModal = () => {
		const data = { ...this.state.data };
		if (!data["email"]) {
			const errors = { ...this.state.errors };
			errors["email"] = "You must type your email for reset it.";

			this.setState({ errors });
			return;
		}

		this.modalSetting.cancelFn = this.closeModal;
		this.modalSetting.okFn = this.resetPassword;
		this.modalSetting.show = true;
		this.setState({ isShowModal: true });
	};

	doSubmit = () => {
		this.setState({ isLoading: true });
		this.props.onLoading(true);
	};

	render() {
		return (
			<>
				<Modal {...this.modalSetting} />
				<form onSubmit={this.handleSubmit} noValidate className="bt-3">
					{this.renderInput("sellerName", "Vendedor", "sellerName")}
					{this.renderInput("clientName", "Cliente", "clientName")}
					<div className="flex justify-center mt-8 mb-5">
						{this.renderSubmit("Terminar")}
					</div>
				</form>
			</>
		);
	}
}

export default CashForm;
