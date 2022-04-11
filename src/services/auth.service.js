import BaseService from "./base.service";

class AuthService extends BaseService {
	constructor() {
		super("/auth");
	}

	userMenu(token) {
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};
			return this.instance.get("/menu", config);
		}

		return Promise.resolve({ data: [] });
	}

	getProfile(id, token) {
		token = localStorage.getItem("token") ?? token;
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};
			return this.instance.get(`/profile/${id}`, config);
		}

		return Promise.resolve({ data: null });
	}

	updateProfile(id, profile) {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};
			return this.instance.put(`/profile/${id}/update`, profile, config);
		}

		return Promise.resolve({ data: null });
	}
}

export default new AuthService();
