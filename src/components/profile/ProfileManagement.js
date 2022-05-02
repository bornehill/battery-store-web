import React, { useState, useEffect } from "react";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";
import SelectControl from "../form-controls/SelectControl";
import ProfileForm from "./ProfileForm";

import { mapListToDropdown } from "../../common/tools/mapEnum";

import AuthService from "../../services/auth.service";

const ProfileManagement = () => {
	const userEmpty = { uid: "", email: "Seleccionar" };
	const emptyProfile = { nickName: "", role: "", userUid: "" };

	const [isLoading, setIsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState(null);
	const [profile, setProfile] = useState(null);
	const [users, setUsers] = useState([]);
	const [userSelected, setUserSelected] = useState(null);

	useEffect(() => {
		if (users.length) return;

		AuthService.getUsers()
			.then(({ data }) => {
				if (data) setUsers([userEmpty, ...data.data]);
			})
			.finally(() => setIsLoading(false))
			.catch((err) => {
				setErrorMessage(err.message);
			});
	}, [users]);

	const getProfile = (id) => {
		setIsLoading(true);

		AuthService.getProfile(id)
			.then(({ data }) => {
				if (data.data) setProfile({ ...data.data, userUid: id });
				else setProfile({ ...emptyProfile, userUid: id });
			})
			.finally(() => setIsLoading(false))
			.catch((err) => {
				setErrorMessage(err.message);
			});
	};

	const handleUserChange = (event) => {
		setUserSelected(event.target.value);
		getProfile(event.target.value);
	};

	function handleSuccess(profile) {
		setProfile(profile);
	}

	const handleError = () => {
		setErrorMessage("Ocurrio un error al guardar el perfil");
	};

	const handleLoading = (loading) => {
		setIsLoading(loading);

		if (isLoading) {
			setErrorMessage("");
		}
	};

	return (
		<React.Fragment>
			<Header />
			{isLoading && <LoadingBar />}
			{errorMessage && (
				<p className="mt-2 text-sm p-2 text-white bg-red-700">{errorMessage}</p>
			)}
			<main className="max-w-screen-xl mx-auto p-4 min-h-screen">
				<div className="w-full h-screen md:max-w-md md:rounded-sm md:mx-auto md:h-auto relative min-h-screen mb-10">
					<h1 className="text-4xl text-center">Perfiles de usuario</h1>
					<div className="m-3">
						<SelectControl
							name="user"
							label="Usuario"
							value={userSelected}
							options={mapListToDropdown(users, "uid", "email")}
							onChange={handleUserChange}
						/>
						{profile && (
							<ProfileForm
								onSuccess={handleSuccess}
								onError={handleError}
								onLoading={handleLoading}
								profileSelected={profile}
							/>
						)}
					</div>
				</div>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default ProfileManagement;
