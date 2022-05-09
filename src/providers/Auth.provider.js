import React, { createContext, useEffect, useState } from "react";
import authFirebase from "../common/auth-firebase";
import authService from "../services/auth.service";

import { REQUEST_STATUS } from "../actions/request-status";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(undefined);
	const [authToken, setAuthToken] = useState(undefined);
	const [profile, setProfile] = useState(undefined);
	const [menu, setMenu] = useState([]);
	const [statusProfile, setStatusProfile] = useState(REQUEST_STATUS.LOADING);

	useEffect(() => {
		authFirebase.auth().onAuthStateChanged((user) => {
			setSession(user);
		});
	}, [currentUser, setCurrentUser]);

	const setSession = (user) => {
		setCurrentUser(user);

		if (!user) return;

		user.getIdToken(true).then((token) => {
			localStorage.setItem("token", token);
			setAuthToken(token);
			getProfile(user?.uid);
		});
	};

	const getProfile = (uid) => {
		if (!uid) return;

		authService
			.getProfile(uid, authToken)
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

	const cleanSession = () => {
		setProfile(undefined);
		setCurrentUser(undefined);
	};

	return (
		<AuthContext.Provider
			value={{
				currentUser,
				profile,
				statusProfile,
				authToken,
				menu,
				setMenu,
				cleanSession,
				setAuthToken,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
