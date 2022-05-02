import React from "react";
import Joi from "joi";

import Form from "../form-controls/Form";
import Modal from "../common/Modal";
import * as ModalTemplates from "../../common/types/ModalTemplates";

import { ProfileType } from "../../common/types/ProfileType";
import { mapEnumToDropdown } from "../../common/tools/mapEnum";

import AuthService from "../../services/auth.service";

class ProfileForm extends Form {
	emptyErrors = {
		nickName: "",
		role: "",
	};

	state = {
		data: this.props.profileSelected,
		errors: this.emptyErrors,
		isLoading: false,
		isShowModal: false,
	};

	formSchema = {
		nickName: Joi.any(),
		role: Joi.string().min(1).message("Perfil requerido").required(),
		userUid: Joi.string().min(1).message("Seleccione un usuario").required(),
		_id: Joi.any(),
		__v: Joi.any(),
	};

	modalSetting = { ...ModalTemplates.ModalSaveProfile };

	closeModal = () => {
		this.modalSetting.show = false;
		this.setState({ isShowModal: false });
	};

	saveProfile = () => {
		this.setState({ isLoading: true });
		this.props.onLoading(true);
		window.scrollTo(0, 0);

		AuthService.updateProfile(this.state.data)
			.then(() => {
				this.props.onSuccess(this.state.data);
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
		this.modalSetting.okFn = this.saveProfile;
		this.modalSetting.cancelFn = this.closeModal;
		this.modalSetting.show = true;
		this.setState({ isShowModal: true });
	};

	componentDidUpdate() {
		if (this.props.profileSelected.userUid !== this.state.data.userUid) {
			this.setState({
				data: this.props.profileSelected,
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
						key={this.state.userUid}
						onSubmit={this.handleSubmit}
						noValidate
						className="bt-3"
					>
						{this.renderInput("nickName", "Nickname", "nickName")}
						{this.renderDropDown(
							"role",
							"Perfil",
							mapEnumToDropdown(ProfileType)
						)}
						<div className="flex justify-center mt-8 mb-5">
							{this.renderSubmit("Guardar")}
						</div>
					</form>
				</div>
			</>
		);
	}
}

export default ProfileForm;
