import React, { useEffect, useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";

import authFirebase from "../../common/auth-firebase";
import authService from "../../services/auth.service";

import { IconContext } from "react-icons";
import { RiLogoutCircleLine } from "react-icons/ri";
import { AuthContext } from "../../providers/Auth.provider";
import { getIcon } from "../../common/tools/getIcon";
import Modal from "../common/Modal";

const SideMenu = ({ show }) => {
	const { authToken, profile } = useContext(AuthContext);

	const history = useHistory();
	const [showModal, setShowModal] = useState(false);
	const [menu, setMenu] = useState([]);

	useEffect(() => {
		if (menu.length) return;

		authService
			.userMenu(authToken)
			.then(({ data }) => {
				if (data.data?.length && profile) {
					const menu = data.data.filter((m) =>
						m.role.find((r) => r === profile.role)
					);
					setMenu(menu);
				}
			})
			.catch();
	}, [authToken, profile]);

	function displayModal() {
		setShowModal(true);
	}

	function closeModal() {
		setShowModal(false);
	}

	function handleLogout() {
		localStorage.removeItem("token");
		authFirebase.auth().signOut();
		history.push("/");
	}

	return (
		<>
			<Modal
				show={showModal}
				title="Cerrar sesion"
				msg="¿Quieres cerrar sesion?"
				okBtn="Aceptar"
				cancelBtn="Cancelar"
				okFn={handleLogout}
				cancelFn={closeModal}
			/>
			<div className={`side-menu ${show ? "open" : "hide"}`}>
				<div>
					<IconContext.Provider value={{ className: "m-1" }}>
						<p>Menu</p>
						<ul>
							{menu?.map((m) => (
								<li className="items-center cursor-pointer" key={"li-" + m.id}>
									<Link className="flex" to={m.path} key={m.id}>
										{getIcon(m.icon)}
										{m.label}
									</Link>
								</li>
							))}
							<li
								className="flex items-center cursor-pointer"
								onClick={displayModal}
							>
								<RiLogoutCircleLine />
								Cerrar sesion
							</li>
						</ul>
					</IconContext.Provider>
				</div>
			</div>
		</>
	);
};

export default SideMenu;
