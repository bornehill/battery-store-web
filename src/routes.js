import React from "react";
import { Route } from "react-router-dom";
import Home from "./components/home/Home";
import SignupView from "./components/login/SignupView";
import CashView from "./components/cash/CashView";
import CutoffView from "./components/cash/CutoffView";
import BrandManagement from "./components/inventory/BrandManagement";
import InventoryManagement from "./components/inventory/InventoryManagement";
import InventoryQuery from "./components/inventory/InventoryQuery";
import EmployeeManagement from "./components/employee/EmployeeManagement";
import LocationManagement from "./components/inventory/LocationManagement";
import NoteDetail from "./components/note/NoteDetail";
import ProductManagement from "./components/inventory/ProductManagement";
import OrderManagement from "./components/order/OrderManagement";
import OrdersView from "./components/order/OrdersView";
import OrderDetail from "./components/order/OrderDetail";
import ProfileManagement from "./components/profile/ProfileManagement";
import LoginView from "./components/login/LoginView";
import InventoryRequestView from "./components/inventory/InventoryRequestView";
import InventoryRequestDetail from "./components/inventory/InventoryRequestDetail";
import NotesAutorization from "./components/note/NotesAutorization";
import CreditPayment from "./components/note/CreditPayment";

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
		path: "/cutoff",
		component: CutoffView,
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
		path: "/orderdetail/:orderId",
		component: OrderDetail,
	},
	{
		path: "/signup",
		component: SignupView,
	},
	{
		path: "/note/:noteId",
		component: NoteDetail,
	},
	{
		path: "/checkorders",
		component: OrdersView,
	},
	{
		path: "/profile",
		component: ProfileManagement,
	},
	{
		path: "/invrequest",
		component: InventoryRequestView,
	},
	{
		path: "/authrequest/:id",
		component: InventoryRequestDetail,
	},
	{
		path: "/cancel/:status",
		component: NotesAutorization,
	},
	{
		path: "/auth/:status",
		component: NotesAutorization,
	},
	{
		path: "/pay/:status",
		component: NotesAutorization,
	},
	{
		path: "/payment/:noteId",
		component: CreditPayment,
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
