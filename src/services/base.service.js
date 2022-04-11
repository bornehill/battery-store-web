import axios from "axios";

export default class BaseService {
	constructor(prefix) {
		this.instance = axios.create({
			baseURL: process.env.REACT_APP_API_URL + prefix,
			headers: { "Content-Type": "application/json" },
		});
	}
}
