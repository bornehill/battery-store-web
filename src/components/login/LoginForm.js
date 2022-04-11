import React from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import Joi from "joi";

import authFirebase from "../../common/auth-firebase";
import Form from "../form-controls/Form";
import Modal from "../common/Modal";
import * as ModalTemplates from "../../common/types/ModalTemplates";
class LoginForm extends Form {
	state = {
		data: { email: "", password: "" },
		errors: { email: "", password: "" },
		isLoading: false,
		isShowModal: false,
	};

	formSchema = {
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.message("Enter a valid e-mail"),
		password: Joi.string()
			.pattern(new RegExp("^[a-zA-Z0-9]{5,30}$"))
			.message(
				"Password must be minimum 5 characters length and special characters are not allowed"
			),
	};

	modalSetting = { ...ModalTemplates.ModalLogin };

	resetPassword = (e) => {
		authFirebase
			.auth()
			.sendPasswordResetEmail(this.state.data.email)
			.then(() => {
				this.modalSetting.show = false;
				this.setState({ isShowModal: false });
			});
	};

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

		firebase
			.auth()
			.setPersistence(firebase.auth.Auth.Persistence.SESSION)
			.then(() => {
				return authFirebase
					.auth()
					.signInWithEmailAndPassword(
						this.state.data.email,
						this.state.data.password
					);
			})
			.finally(() => {
				this.setState({ isLoading: false });
				this.props.onLoading(false);
			})
			.then(this.props.onSuccess)
			.catch(this.props.onError);
	};

	render() {
		return (
			<>
				<Modal {...this.modalSetting} />
				<form onSubmit={this.handleSubmit} noValidate>
					{this.renderInput("email", "E-mail", "email")}
					{this.renderInput("password", "Password", "password")}
					<p className="text-sm">
						Olvidaste la contraseña?{" "}
						<button
							className="cursor-pointer font-bold"
							type="button"
							onClick={this.openModal}
						>
							Click aqui
						</button>{" "}
						para recuperarla.
					</p>
					<div className="flex justify-between mt-8">
						<Link to="/signup" className="btn btn-tertiary">
							Create account
						</Link>
						{this.renderSubmit("Entrar")}
					</div>
				</form>
			</>
		);
	}
}

export default LoginForm;
