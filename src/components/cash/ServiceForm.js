import React from "react";
import Joi from "joi";

import Form from "../form-controls/Form";
import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Modal from "../common/Modal";
import * as ModalTemplates from "../../common/types/ModalTemplates";

import storeService from "../../services/store.service";

class CashForm extends Form {
	emptyErrors = {
		description: "",
		amount: "",
	};

	state = {
		data: { description: "", amount: 0 },
		errors: this.emptyErrors,
		isLoading: false,
		isShowModal: false,
		errorMessage: "",
	};

	formSchema = {
		description: Joi.string()
			.min(3)
			.message("Se requiere indicar el servicio (min: 3 caracteres)"),
		amount: Joi.number().min(1).message("indique el monto del servicio"),
		serviceId: Joi.any(),
	};

	modalSetting = { ...ModalTemplates.ModalServicePayment };

	closeModal = () => {
		this.modalSetting.show = false;
		this.setState({ isShowModal: false });
	};

	addService = () => {
		this.modalSetting.show = false;
		this.setState({ isLoading: true, isShowModal: false, errorMessage: "" });
		window.scrollTo(0, 0);

		const service = {
			description: this.state.data.description,
			amount: this.state.data.amount,
		};

		storeService
			.addService(service)
			.then((data) => {
				this.setState({
					isLoading: false,
					data: { ...this.emptyErrors },
					serviceId: data.data._id,
					errors: this.emptyErrors,
				});
			})
			.finally(() => {
				this.setState({ isLoading: false });
			})
			.catch((err) => {
				this.setState({ errorMessage: err?.message ?? "Request error" });
			});
	};

	doSubmit = () => {
		this.modalSetting.okFn = this.addService;
		this.modalSetting.cancelFn = this.closeModal;
		this.modalSetting.show = true;
		this.setState({ isShowModal: true });
	};

	render() {
		return (
			<>
				<Header />
				{this.state.isLoading && <LoadingBar />}
				{this.state.errorMessage && (
					<p className="mt-2 text-sm p-2 text-white bg-red-700">
						{this.state.errorMessage}
					</p>
				)}

				<Modal {...this.modalSetting} />
				<div className="w-full h-screen md:max-w-md md:rounded-sm md:mx-auto md:h-auto relative min-h-screen mb-10">
					<h1 className="text-4xl text-center">Servicios</h1>
					<form
						key={this.state.serviceId}
						onSubmit={this.handleSubmit}
						noValidate
					>
						{this.renderInput("description", "Descripcion")}
						{this.renderInput("amount", "Monto", "number")}
						<div className="flex justify-center mt-8 mb-5">
							{this.renderSubmit("Agregar")}
						</div>
					</form>
				</div>
			</>
		);
	}
}

export default CashForm;
