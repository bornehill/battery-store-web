import BaseService from "./base.service";

class StoreService extends BaseService {
	constructor() {
		super("/store");
	}

	getBrands() {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};
			return this.instance.get("/brands", config);
		}

		return Promise.resolve({ data: null });
	}

	addBrand(brand) {
		const token = localStorage.getItem("token");

		const requestConfig = {
			headers: {
				"x-auth-token": `Bearer ${token}`,
			},
			transformResponse: [
				(data) => {
					return data.data;
				},
			],
		};

		return this.instance.post("/brands", brand, requestConfig);
	}

	getLocations() {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};
			return this.instance.get("/", config);
		}

		return Promise.resolve({ data: null });
	}

	addLocation(location) {
		const token = localStorage.getItem("token");

		const requestConfig = {
			headers: {
				"x-auth-token": `Bearer ${token}`,
			},
			transformResponse: [
				(data) => {
					return data.data;
				},
			],
		};

		return this.instance.post("/locations", location, requestConfig);
	}

	getProducts(query) {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};

			return this.instance.get(`/products?${query}`, config);
		}

		return Promise.resolve({ data: null });
	}

	addProduct(product) {
		const token = localStorage.getItem("token");

		const requestConfig = {
			headers: {
				"x-auth-token": `Bearer ${token}`,
			},
			transformResponse: [
				(data) => {
					return data.data;
				},
			],
		};

		return this.instance.post("/products", product, requestConfig);
	}

	updateProduct(product) {
		const token = localStorage.getItem("token");

		const requestConfig = {
			headers: {
				"x-auth-token": `Bearer ${token}`,
			},
			transformResponse: [
				(data) => {
					return data.data;
				},
			],
		};

		return this.instance.put("/products", product, requestConfig);
	}
}

export default new StoreService();
