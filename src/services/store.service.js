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

	getInventory(location) {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};

			return this.instance.get(`/inventory/${location}`, config);
		}

		return Promise.resolve({ data: null });
	}

	inputOutput(mov) {
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

		return this.instance.put("/inventory", mov, requestConfig);
	}

	addOrder(order) {
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

		return this.instance.post("/order", order, requestConfig);
	}

	addNote(note) {
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

		return this.instance.post("/note", note, requestConfig);
	}

	getOrders(query) {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};

			return this.instance.get(`/order?${query}`, config);
		}

		return Promise.resolve({ data: null });
	}

	getEmployees() {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};

			return this.instance.get("/employee", config);
		}

		return Promise.resolve({ data: null });
	}

	addEmployee(employee) {
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

		return this.instance.post("/employee", employee, requestConfig);
	}

	updateEmployee(employee) {
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

		return this.instance.put("/employee", employee, requestConfig);
	}

	getNotes(filter) {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};

			return this.instance.get(`/notes?${filter}`, config);
		}

		return Promise.resolve({ data: null });
	}

	updateNoteStatus(noteId, status) {
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

		return this.instance.post(`/note/${noteId}`, status, requestConfig);
	}
}

export default new StoreService();
