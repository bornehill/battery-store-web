import React from "react";
import { Route } from "react-router-dom";
import Home from "./components/home/Home";
import SignupView from "./components/login/SignupView";
import BrandManagement from "./components/inventory/BrandManagement";
import InventoryManagement from "./components/inventory/InventoryManagement";
import InventoryQuery from "./components/inventory/InventoryQuery";
import LocationManagement from "./components/inventory/LocationManagement";
import ProductManagement from "./components/inventory/ProductManagement";
import LoginView from "./components/login/LoginView";

export const routes = [
	{
		path: "/",
		component: LoginView,
		exact: true,
	},
	{
		path: "/home",
		component: Home,
	},
	{
		path: "/brands",
		component: BrandManagement,
	},
	{
		path: "/inventory",
		component: InventoryQuery,
	},
	{
		path: "/inventorymov",
		component: InventoryManagement,
	},
	{
		path: "/locations",
		component: LocationManagement,
	},
	{
		path: "/products",
		component: ProductManagement,
	},
	{
		path: "/signup",
		component: SignupView,
	},
];

export function RouteWithSubRoutes(route) {
	return (
		<Route
			path={route.path}
			render={(props) => <route.component {...props} routes={route.routes} />}
		/>
	);
}

export default routes;
