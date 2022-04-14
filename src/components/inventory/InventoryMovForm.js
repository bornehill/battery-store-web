import React from "react";
import Joi from "joi";

import storeService from "../../services/store.service";

import Form from "../form-controls/Form";
import { mapListToDropdown } from "../../common/tools/mapEnum";

class InvenoryMovForm extends Form {
	emptyProduct = {
		id: "",
		description: "Seleccionar",
	};

	emptyErrors = {
		id: "",
		amount: "",
	};

	state = {
		data: this.props.productSelected,
		errors: this.emptyErrors,
		isLoading: false,
		isShowModal: false,
		products: [this.emptyProduct],
	};

	formSchema = {
		brand: Joi.string(),
		group: Joi.string(),
		id: Joi.string().min(1).message("Seleccione un producto").required(),
		amount: Joi.number().min(1).message("Indique la cantidad").required(),
	};

	getProducts = (brand) => {
		storeService
			.getProducts(`brand=${brand}`)
			.then(({ data }) => {
				if (data.data.length)
					this.setState({ products: [this.emptyProduct, ...data.data] });
				else this.setState({ products: [this.emptyProduct] });
			})
			.finally(() => {
				this.setState({
					isLoading: false,
				});
				this.props.onLoading(false);
			})
			.catch((err) => this.props.onError(err?.message ?? "Request error"));
	};

	brandChanged = (event) => {
		this.setState({
			isLoading: true,
			data: { ...this.state.data, brand: event.target.value },
		});
		this.props.onLoading(true);
		window.scrollTo(0, 0);
		this.getProducts(event.target.value);
	};

	addProduct = () => {
		const product = this.state.products.find(
			(p) => p.id === this.state.data.id
		);
		this.props.onSuccess({ product, amount: this.state.data.amount });
	};

	doSubmit = () => {
		this.addProduct();
	};

	render() {
		return (
			<>
				<div className="p-5 bg-gray-300">
					<form
						key={this.state.data.id ? this.state.data.id : "productForm"}
						onSubmit={this.handleSubmit}
						noValidate
					>
						{this.renderDropDownHandled(
							"brand",
							"Marca",
							mapListToDropdown(this.props.brands, "name", "name"),
							this.brandChanged
						)}
						{this.renderDropDown(
							"id",
							"Producto",
							mapListToDropdown(this.state.products, "id", "description")
						)}
						{this.renderInput("amount", "Cantidad")}
						<div className="flex items-center justify-between mt-8">
							{this.renderSubmit("Agregar")}
						</div>
					</form>
				</div>
			</>
		);
	}
}

export default InvenoryMovForm;
