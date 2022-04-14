import React, { Component } from "react";
import Joi from "joi";
import InputControl from "./InputControl";
import SelectControl from "./SelectControl";
import UpLoadImage from "./UpLoadImage";

class Form extends Component {
	state = {
		data: {},
		errors: {},
		isLoading: false,
	};

	/** Validates the complete form */
	validate = () => {
		const joiOpts = { abortEarly: false };
		const { error } = Joi.object(this.formSchema).validate(
			this.state.data,
			joiOpts
		);
		if (!error) {
			return null;
		}

		let errors = {};
		for (let item of error.details) {
			errors[item.path[0]] = item.message;
		}

		return errors;
	};

	/** Validate a specific property in the form */
	validateProperty = ({ name, value }) => {
		const { error } = this.formSchema[name].validate(value);

		return error ? error.message : "";
	};

	handleSubmit = (e) => {
		e.preventDefault();
		let errors = { ...this.state.errors };
		if (errors.logo) return;

		errors = this.validate();
		if (errors) {
			this.setState({ errors });
			return;
		}

		this.doSubmit();
	};

	handleChange = ({ currentTarget: input }) => {
		const errors = { ...this.state.errors };
		const data = { ...this.state.data };

		errors[input.name] = this.validateProperty(input).replace(
			"value",
			input.name
		);
		data[input.name] = input.type === "checkbox" ? input.checked : input.value;

		this.setState({ data, errors });
	};

	handleImage = (name, image, imageSize) => {
		const errors = { ...this.state.errors };
		const data = { ...this.state.data };

		if (!image && !imageSize) {
			errors[name] = "";
			data[name] = "";
			data[`${name}Size`] = 0;
			this.setState({ data, errors });
			return;
		}

		errors[name] = imageSize > 1048576 ? "Image size must be less that 1M" : "";
		if (!errors[name]) {
			data[name] = image;
			data[`${name}Size`] = imageSize;
		}

		this.setState({ data, errors });
	};

	renderSubmit(label) {
		return (
			<button
				disabled={this.state.isLoading}
				className="btn btn-primary"
				type="submit"
			>
				{label}
			</button>
		);
	}

	renderInput(name, label, type = "text", disabled = false) {
		const { data, errors } = this.state;

		return (
			<InputControl
				type={type}
				label={label}
				name={name}
				defaultValue={data[name]}
				error={errors[name]}
				disabled={disabled}
				onChange={this.handleChange}
			/>
		);
	}

	renderDropDown(name, label, options, disabled) {
		const { data, errors } = this.state;

		return (
			<SelectControl
				name={name}
				label={label}
				value={data[name]}
				options={options}
				error={errors[name]}
				onChange={this.handleChange}
				disabled={disabled}
			/>
		);
	}

	renderDropDownHandled(name, label, options, handleChange, disabled) {
		const { data, errors } = this.state;

		return (
			<SelectControl
				name={name}
				label={label}
				value={data[name]}
				options={options}
				error={errors[name]}
				onChange={handleChange}
				disabled={disabled}
			/>
		);
	}

	renderCheckbox(name, label) {
		const { data, errors } = this.state;

		return (
			<InputControl
				type="checkbox"
				label={label}
				name={name}
				defaultChecked={data[name]}
				error={errors[name]}
				onChange={this.handleChange}
			/>
		);
	}

	renderUploadImage(name, label, imgSize, disabled = false) {
		const { errors } = this.state;

		return (
			<UpLoadImage
				label={label}
				name={name}
				error={errors[name]}
				disabled={disabled}
				handleValues={this.handleImage}
				imgSize={imgSize}
			/>
		);
	}
}

export default Form;
