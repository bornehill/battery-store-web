import React from "react";
import Joi from "joi";

import storeService from "../../services/store.service";

import Form from "../form-controls/Form";
import Modal from "../common/Modal";
import * as ModalTemplates from "../../common/types/ModalTemplates";

class EmployeeForm extends Form {
	emptyErrors = {
		firstName: "",
		lastName: "",
		position: "",
		phone: "",
	};

	state = {
		data: this.props.employeeSelected,
		errors: this.emptyErrors,
		isLoading: false,
		isShowModal: false,
	};

	formSchema = {
		firstName: Joi.string().min(2).message("Nombre requerido").required(),
		lastName: Joi.string().min(2).message("Apellido requerido").required(),
		position: Joi.string(),
		phone: Joi.any(),
		id: Joi.any(),
		_id: Joi.any(),
		__v: Joi.any(),
	};

	modalSetting = { ...ModalTemplates.ModalSaveEmployee };

	closeModal = () => {
		this.modalSetting.show = false;
		this.setState({ isShowModal: false });
	};

	save = () => {
		this.setState({ isLoading: true });
		this.props.onLoading(true);
		window.scrollTo(0, 0);

		if (this.state.data.id) {
			this.updateEmployee();
		} else {
			this.addEmployee();
		}
	};

	updateEmployee = () => {
		storeService
			.updateEmployee(this.state.data)
			.then(() => {
				this.setState({ isLoading: false });
				this.props.onSuccess("Empleado actualizado!");
			})
			.finally(() => {
				this.modalSetting.show = false;
				this.setState({
					isLoading: false,
					isShowModal: false,
				});
				this.props.onLoading(false);
			})
			.catch((err) => this.props.onError(err?.message ?? "Request error"));
	};

	addEmployee = () => {
		storeService
			.addEmployee(this.state.data)
			.then(() => {
				this.setState({ isLoading: false });
				this.props.onSuccess("Empleado agregado!");
			})
			.finally(() => {
				this.modalSetting.show = false;
				this.setState({
					isLoading: false,
					isShowModal: false,
				});
				this.props.onLoading(false);
			})
			.catch((err) => this.props.onError(err?.message ?? "Request error"));
	};

	doSubmit = () => {
		if (this.state.data.id) {
			this.modalSetting.title = "Actualizar empleado";
			this.modalSetting.msg = "El empleado será actualizado. ¿esta segur@?";
		} else {
			this.modalSetting.title = "Agregar empleado";
			this.modalSetting.msg = "El empleado será agregado. ¿esta segur@?";
		}

		this.modalSetting.okFn = this.save;
		this.modalSetting.cancelFn = this.closeModal;
		this.modalSetting.show = true;
		this.setState({ isShowModal: true });
	};

	componentDidUpdate() {
		if (
			(this.props.employeeSelected.id && !this.state.data.id) ||
			(!this.props.employeeSelected.id && this.state.data.id) ||
			(this.props.employeeSelected.id &&
				this.state.data.id &&
				this.props.employeeSelected.id !== this.state.data.id)
		) {
			this.setState({
				data: this.props.employeeSelected,
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
						key={this.state.data.id ? this.state.data.id : "employeeForm"}
						onSubmit={this.handleSubmit}
						noValidate
					>
						{this.renderInput("firstName", "Nombre")}
						{this.renderInput("lastName", "Apellido")}
						{this.renderInput("position", "Puesto")}
						{this.renderInput("phone", "Tel")}
						<div className="flex items-center justify-between mt-8">
							{this.renderSubmit(
								this.state.data.id ? "Acualizar empleado" : "Agregar empleado"
							)}
						</div>
					</form>
				</div>
			</>
		);
	}
}

export default EmployeeForm;
