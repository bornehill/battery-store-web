import React, { createContext, useEffect, useState } from "react";
import authFirebase from "../common/auth-firebase";
import authService from "../services/auth.service";

import { REQUEST_STATUS } from "../actions/request-status";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [authToken, setAuthToken] = useState(null);
	const [profile, setProfile] = useState(null);
	const [statusProfile, setStatusProfile] = useState(REQUEST_STATUS.LOADING);

	useEffect(() => {
		authFirebase.auth().onAuthStateChanged((user) => {
			setSession(user);
		});
	}, [currentUser, setCurrentUser]);

	const setSession = (user) => {
		setCurrentUser(user);

		if (!user) return;

		authFirebase
			.auth()
			.currentUser.getIdToken(true)
			.then((token) => {
				localStorage.setItem("token", token);
				setAuthToken(token);
				getProfile();
			});
	};

	const getProfile = () => {
		if (!currentUser) return;

		authService
			.getProfile(currentUser.uid, authToken)
			.then(({ data }) => {
				if (data?.data) {
					setProfile(data?.data);
				}
			})
			.finally(() => {
				setStatusProfile(REQUEST_STATUS.PROFILE_LOADED);
			})
			.catch();
	};

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				profile,
				statusProfile,
				authToken,
				setProfile,
				setAuthToken,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
