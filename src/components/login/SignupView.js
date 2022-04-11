import React, { useState } from "react";
import SignupForm from "./SignupForm";
import LoadingBar from "../common/LoadingBar";
import Header from "../common/Header";
import Footer from "../common/Footer";

const SignupView = (signup) => {
	const [isLoading, setIsLoading] = useState(false);
	const [hasSignupFailed, setHasSignupFailed] = useState(false);

	const handleSuccess = () => {
		signup.history.push("/home");
	};

	const handleError = (error) => {
		setHasSignupFailed(true);
	};

	const handleLoading = (loading) => {
		setIsLoading(loading);

		if (isLoading) {
			setHasSignupFailed(false);
		}
	};

	return (
		<React.Fragment>
			<Header />
			<main>
				<div className="w-full h-screen card card-white md:max-w-md md:rounded-sm md:mx-auto md:h-auto relative">
					{isLoading && <LoadingBar />}
					<div className="p-10">
						<h1 className="text-center text-2xl font-emphasis">Sign up</h1>
						{hasSignupFailed && (
							<p className="mt-2 text-sm p-2 text-white bg-red-700">
								Invalid signup
							</p>
						)}
						<SignupForm
							onSuccess={handleSuccess}
							onError={handleError}
							onLoading={handleLoading}
						/>
					</div>
				</div>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default SignupView;
