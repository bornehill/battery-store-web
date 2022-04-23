import React from "react";
import { Route } from "react-router-dom";
import Home from "./components/home/Home";
import SignupView from "./components/login/SignupView";
import CashView from "./components/cash/CashView";
import BrandManagement from "./components/inventory/BrandManagement";
import InventoryManagement from "./components/inventory/InventoryManagement";
import InventoryQuery from "./components/inventory/InventoryQuery";
import LocationManagement from "./components/inventory/LocationManagement";
import EmployeeManagement from "./components/employee/EmployeeManagement";
import ProductManagement from "./components/inventory/ProductManagement";
import OrderManagement from "./components/order/OrderManagement";
import LoginView from "./components/login/LoginView";

export const routes = [
	{
		path: "/",
		component: LoginView,
		exact: true,
	},
	{
		path: "/cash",
		component: CashView,
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
		path: "/employee",
		component: EmployeeManagement,
	},
	{
		path: "/products",
		component: ProductManagement,
	},
	{
		path: "/order",
		component: OrderManagement,
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
