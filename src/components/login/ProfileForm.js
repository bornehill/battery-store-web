import React from "react";
import Joi from "joi";

import authService from "../../services/auth.service";

import Form from "../form-controls/Form";
import Modal from "../common/Modal";
import * as ModalTemplates from "../../common/types/ModalTemplates";
import { CountryDropDown } from "../../common/types/Country";
import { mapEnumToDropdown } from "../../common/tools/mapEnum";

class UserForm extends Form {
	emptyUser = {
		nickName: "",
		phone: "",
		country: "MX",
		state: "",
		zipcode: "",
	};

	emptyErrors = {
		nickName: "",
		phone: "",
		country: "",
		state: "",
		zipcode: "",
	};

	state = {
		data: this.props.profile ?? this.emptyUser,
		errors: this.emptyErrors,
		isLoading: false,
		isShowModal: false,
		show: false,
	};

	formSchema = {
		nickName: Joi.string()
			.pattern(new RegExp("^[a-zA-Z0-9_ ]{5,30}$"))
			.message("Name must be minimum 5 characters length"),
		phone: Joi.string()
			.pattern(new RegExp("^[0-9]{3}-[0-9]{3}-[0-9]{4}$"))
			.message("Phone must be format 999-999-9999"),
		country: Joi.string().min(2),
		state: Joi.string().min(2),
		zipcode: Joi.string()
			.pattern(new RegExp("^[a-zA-Z0-9_ ]{5,15}$"))
			.message("Name must be minimum 5 characters length"),
		_id: Joi.any(),
		userUid: Joi.any(),
		__v: Joi.any(),
		id: Joi.any(),
	};

	modalSetting = { ...ModalTemplates.ModalUpdateProfile };

	closeModal = () => {
		this.modalSetting.show = false;
		this.setState({ isShowModal: false });
	};

	save = () => {
		this.setState({ isLoading: true });
		this.props.onLoading(true);
		window.scrollTo(0, 0);
		this.updateProfile();
	};

	updateProfile = () => {
		authService
			.updateProfile(this.props.uid, this.state.data)
			.then(({ data }) => {
				this.props.onSuccess(data.data);
			})
			.finally(() => {
				this.modalSetting.show = false;
				this.setState({ isLoading: false, isShowModal: false });
				this.props.onLoading(false);
			})
			.catch((err) => this.props.onError(err?.message ?? "Request error"));
	};

	doSubmit = () => {
		this.modalSetting.okFn = this.save;
		this.modalSetting.cancelFn = this.closeModal;
		this.modalSetting.show = true;
		this.setState({ isShowModal: true });
	};

	componentDidUpdate() {
		if (this.props.show !== this.state.show) {
			this.setState({
				show: this.props.show,
				data: this.props.profile ?? this.emptyUser,
			});
		}
	}

	render() {
		return (
			<>
				<Modal {...this.modalSetting} />
				<div
					className={`profile-form p-5 ${
						this.state.show ? "open-profile" : "hide-profile"
					}`}
				>
					<form key="profileForm" onSubmit={this.handleSubmit} noValidate>
						{this.renderInput("nickName", "Nickname")}
						{this.renderInput("phone", "Phone", "tel")}
						{this.renderDropDown(
							"country",
							"Country",
							mapEnumToDropdown(CountryDropDown),
							this.state.data?.id ? true : false
						)}
						{this.renderInput("state", "State")}
						{this.renderInput("zipcode", "Zip code")}
						<div className="flex items-center justify-between mt-8">
							{this.renderSubmit("Update profile")}
						</div>
					</form>
				</div>
			</>
		);
	}
}

export default UserForm;
