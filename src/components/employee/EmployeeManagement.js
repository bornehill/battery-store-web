import React, { useReducer, useEffect, useState } from "react";

import Header from "../common/Header";
import LoadingBar from "../common/LoadingBar";
import Footer from "../common/Footer";
import EmployeeForm from "./EmployeeForm";

import { GET_FAILURE, PRODUCTS_LOADED } from "../../actions/request";
import { REQUEST_STATUS } from "../../actions/request-status";
import { IconContext } from "react-icons";
import { MdEdit } from "react-icons/md";

import storeService from "../../services/store.service";
import requestReducer from "../../reducers/request-reducer";

const EmployeeManagement = () => {
	const emptyEmployee = {
		firstName: "",
		lastName: "",
		position: "",
		phone: "",
	};

	const [employeeSelected, setEmployeeSelected] = useState(emptyEmployee);
	const [isLoading, setIsLoading] = useState(false);
	const [hasAddFailed, setHasAddFailed] = useState(false);
	const [{ products: employees }, dispatch] = useReducer(requestReducer, {
		status: REQUEST_STATUS.LOADING,
		products: [],
	});

	useEffect(() => {
		loadEmployees();
	}, []);

	function loadEmployees(brand) {
		setIsLoading(true);
		storeService
			.getEmployees()
			.then(({ data }) => {
				if (data) {
					data.data.sort(sortByLastName);
					dispatch({
						products: [...data.data],
						type: PRODUCTS_LOADED,
					});
				}
			})
			.finally(() => {
				setIsLoading(false);
				setEmployeeSelected(emptyEmployee);
			})
			.catch((err) => {
				console.log("error: ", err);
				dispatch({
					type: GET_FAILURE,
					error: err,
				});
			});
	}

	function handleSuccess() {
		loadEmployees();
		setEmployeeSelected({ ...emptyEmployee, id: "1" });
	}

	const handleError = () => {
		setHasAddFailed(true);
	};

	const handleLoading = (loading) => {
		setIsLoading(loading);

		if (isLoading) {
			setHasAddFailed(false);
		}
	};

	function handleSelectItem(employee) {
		setEmployeeSelected({ ...employee, id: employee._id });
	}

	function sortByLastName(a, b) {
		return a.lastName.localeCompare(b.lastName);
	}

	return (
		<React.Fragment>
			<Header />
			{isLoading && <LoadingBar />}
			{hasAddFailed && (
				<p className="mt-2 text-sm p-2 text-white bg-red-700">
					Ha ocurrido un error al agregar el empleado. Por favor intentelo de
					nuevo.
				</p>
			)}
			<main className="max-w-screen-xl mx-auto p-4 min-h-screen">
				<div className="flex items-center justify-between p-4">
					<h1 className="text-4xl">Administrador de empleados</h1>
				</div>
				<section className="flex">
					<div className="md:w-4/6 ">
						{employees && employees.length ? (
							<table className="border-separate text-left border-flame-700 md:w-3/4">
								<thead>
									<tr className="text-center text-blue-900">
										<th className="border-blue-900 font-light">Nombre</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											Apellido
										</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											Puesto
										</th>
										<th className="border-blue-900 font-light hidden md:table-cell">
											Telefono
										</th>
										<th className="border-blue-900 font-light">Accion</th>
									</tr>
								</thead>
								<tbody>
									{employees.map((employee) => (
										<tr className="text-gray-800" key={employee._id}>
											<td className="border-t-2 border-yellow-600 font-light px-2">
												{employee.firstName}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{employee.lastName}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{employee.position}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 hidden md:table-cell">
												{employee.phone}
											</td>
											<td className="border-t-2 border-yellow-600 font-light px-2 flex">
												<IconContext.Provider
													value={{
														className: "m-3 text-flame-700",
														size: "20px",
													}}
												>
													<MdEdit
														key={"edit_" + employee._id}
														className="cursor-pointer"
														onClick={() => handleSelectItem(employee)}
														title="Actualizar empleado"
													/>
												</IconContext.Provider>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						) : (
							<div className="text-2xl text-flame-700">
								{isLoading ? "Cargando..." : "No hay empleados para mostrar."}
							</div>
						)}
					</div>
					<div className="w-full md:w-2/6">
						<EmployeeForm
							onSuccess={handleSuccess}
							onError={handleError}
							onLoading={handleLoading}
							employeeSelected={employeeSelected}
						/>
					</div>
				</section>
			</main>
			<Footer />
		</React.Fragment>
	);
};

export default EmployeeManagement;
