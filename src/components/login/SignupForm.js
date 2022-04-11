import React from "react";
import Joi from "joi";
import Form from "../form-controls/Form";
import authFirebase from "../../common/auth-firebase";

class SignupForm extends Form {
	state = {
		data: { email: "", password: "", confirmPass: "" },
		errors: { email: "", password: "", confirmPass: "" },
		isLoading: false,
	};

	formSchema = {
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.message("Enter a valid e-mail"),
		password: Joi.string()
			.pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
			.message("Password must be minimum 6 characters length"),
		confirmPass: Joi.string()
			.pattern(new RegExp("^[a-zA-Z0-9]{6,30}$"))
			.message("Confirm password must be minimum 6 characters length"),
	};

	invalidConfirmPass() {
		const { password, confirmPass } = this.state.data;

		if (password !== confirmPass) {
			const errors = { ...this.state.errors };
			errors["confirmPass"] = "Confirm Passord error";

			this.setState({ errors });
			return true;
		}

		return false;
	}

	doSubmit = () => {
		if (this.invalidConfirmPass()) {
			return;
		}

		this.setState({ isLoading: true });
		this.props.onLoading(true);

		authFirebase
			.auth()
			.createUserWithEmailAndPassword(
				this.state.data.email,
				this.state.data.password
			)
			.finally(() => {
				this.setState({ isLoading: false });
				this.props.onLoading(false);
			})
			.then(this.props.onSuccess)
			.catch(this.props.onError);
	};

	render() {
		return (
			<form onSubmit={this.handleSubmit} noValidate>
				{this.renderInput("email", "E-mail", "email")}
				{this.renderInput("password", "Password", "password")}
				{this.renderInput("confirmPass", "Confirm Password", "password")}
				<div className="flex items-center justify-between mt-8">
					{this.renderSubmit("Sign up")}
				</div>
			</form>
		);
	}
}

export default SignupForm;
