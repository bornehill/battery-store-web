import {
	GET_FAILURE,
	BRAND_SUCCESS,
	PRODUCTS_LOADED,
	PROFILE_LOADED,
	LOCATION_SUCCESS,
} from "../actions/request";

import { REQUEST_STATUS } from "../actions/request-status";

const requestReducer = (state, action) => {
	switch (action.type) {
		case BRAND_SUCCESS: {
			return {
				...state,
				brands: action.brands,
				status: REQUEST_STATUS.SUCCESS,
			};
		}
		case LOCATION_SUCCESS: {
			return {
				...state,
				locations: action.locations,
				status: REQUEST_STATUS.SUCCESS,
			};
		}
		case GET_FAILURE: {
			return {
				...state,
				status: REQUEST_STATUS.ERROR,
				error: action.error,
			};
		}
		case PRODUCTS_LOADED: {
			return {
				...state,
				products: action.products,
				status: REQUEST_STATUS.SUCCESS,
			};
		}
		case PROFILE_LOADED: {
			return {
				...state,
				profile: action.profile,
				status: REQUEST_STATUS.SUCCESS,
			};
		}
		default:
			return state;
	}
};

export default requestReducer;
