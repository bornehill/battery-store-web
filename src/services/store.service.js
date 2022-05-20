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

	getInvRequest() {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};

			return this.instance.get("/invrequest", config);
		}

		return Promise.resolve({ data: null });
	}

	invrequest(mov) {
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

		return this.instance.post("/invrequest", mov, requestConfig);
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

	getOrdersBySeller(query) {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};

			return this.instance.get(`/orders?${query}`, config);
		}

		return Promise.resolve({ data: null });
	}

	cancelOrder(orderId) {
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

		return this.instance.put(
			`/order/${orderId}`,
			{ status: "canceled" },
			requestConfig
		);
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

	getNotesByStatus(status) {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};

			return this.instance.get(`/notes/${status}`, config);
		}

		return Promise.resolve({ data: null });
	}

	cancelNote(noteId) {
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

		return this.instance.post(`/note/cancel/${noteId}`, {}, requestConfig);
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

		return this.instance.put(`/note/status/${noteId}`, status, requestConfig);
	}

	getPayments(filter) {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};

			return this.instance.get(`/payment?${filter}`, config);
		}

		return Promise.resolve({ data: null });
	}

	payCredit(payment) {
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

		return this.instance.post("/payment", payment, requestConfig);
	}

	addService(service) {
		const token = localStorage.getItem("token");

		const requestConfig = {
			headers: {
				"x-auth-token": `Bearer ${token}`,
			},
			transformResponse: [
				(data) => {
					const response = JSON.parse(data);
					return response.data;
				},
			],
		};

		return this.instance.post("/service", service, requestConfig);
	}

	getService(filter) {
		const token = localStorage.getItem("token");
		if (token) {
			const config = {
				headers: {
					"x-auth-token": `Bearer ${token}`,
				},
			};

			return this.instance.get(`/service?${filter}`, config);
		}

		return Promise.resolve({ data: null });
	}
}

export default new StoreService();
