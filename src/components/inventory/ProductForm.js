import React from "react";
import Joi from "joi";

import storeService from "../../services/store.service";

import Form from "../form-controls/Form";
import Modal from "../common/Modal";
import * as ModalTemplates from "../../common/types/ModalTemplates";
import { Groups } from "../../common/types/Groups";
import {
	mapEnumToDropdown,
	mapListToDropdown,
} from "../../common/tools/mapEnum";

class ProductForm extends Form {
	emptyErrors = {
		brand: "",
		description: "",
		group: "",
		amp: "",
		price: "",
	};

	state = {
		data: this.props.productSelected,
		errors: this.emptyErrors,
		isLoading: false,
		isShowModal: false,
	};

	formSchema = {
		brand: Joi.string(),
		description: Joi.string()
			.min(3)
			.message("Descripcion requerida")
			.required(),
		group: Joi.string(),
		amp: Joi.any(),
		price: Joi.number().min(100).message("Precio requerido").required(),
		id: Joi.any(),
		_id: Joi.any(),
		__v: Joi.any(),
	};

	modalSetting = { ...ModalTemplates.ModalSaveProduct };

	closeModal = () => {
		this.modalSetting.show = false;
		this.setState({ isShowModal: false });
	};

	save = () => {
		this.setState({ isLoading: true });
		this.props.onLoading(true);
		window.scrollTo(0, 0);

		if (this.state.data.id) {
			this.updateProduct();
		} else {
			this.addProduct();
		}
	};

	updateProduct = () => {
		storeService
			.updateProduct(this.state.data)
			.then(() => {
				this.setState({ isLoading: false });
				this.props.onSuccess("Producto actualizado!");
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

	addProduct = () => {
		storeService
			.addProduct(this.state.data)
			.then(() => {
				this.setState({ isLoading: false });
				this.props.onSuccess("Producto agregado!");
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
			this.modalSetting.title = "Actualizar producto";
			this.modalSetting.msg = "El producto será actualizado. ¿esta seguro?";
		} else {
			this.modalSetting.title = "Agregar Producto";
			this.modalSetting.msg = "El producto será agregado. ¿esta seguro?";
		}

		this.modalSetting.okFn = this.save;
		this.modalSetting.cancelFn = this.closeModal;
		this.modalSetting.show = true;
		this.setState({ isShowModal: true });
	};

	componentDidUpdate() {
		if (
			(this.props.productSelected.id && !this.state.data.id) ||
			(!this.props.productSelected.id && this.state.data.id) ||
			(this.props.productSelected.id &&
				this.state.data.id &&
				this.props.productSelected.id !== this.state.data.id)
		) {
			this.setState({
				data: this.props.productSelected,
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
						key={this.state.data.id ? this.state.data.id : "productForm"}
						onSubmit={this.handleSubmit}
						noValidate
					>
						{this.renderDropDown(
							"brand",
							"Marca",
							mapListToDropdown(
								[{ name: "" }, ...this.props.brands],
								"name",
								"name"
							)
						)}
						{this.renderInput(
							"description",
							"Descripcion",
							"text",
							!!this.state.data._id
						)}
						{this.renderInput("price", "Precio", "number")}
						{this.renderInput("amp", "Amperaje")}
						{this.renderDropDown("group", "Grupo", mapEnumToDropdown(Groups))}
						<div className="flex items-center justify-between mt-8">
							{this.renderSubmit(
								this.state.data.id ? "Acualizar producto" : "Agregar producto"
							)}
						</div>
					</form>
				</div>
			</>
		);
	}
}

export default ProductForm;
