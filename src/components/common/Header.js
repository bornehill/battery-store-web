import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import SideMenu from "./SideMenu";
import Modal from "../common/Modal";
import * as ModalTemplates from "../../common/types/ModalTemplates";
import LoadingBar from "../common/LoadingBar";

import { IconContext } from "react-icons";
import { GiHamburgerMenu } from "react-icons/gi";
import { AuthContext } from "../../providers/Auth.provider";

const Header = () => {
	const { currentUser } = useContext(AuthContext);
	const [openMenu, setOpenMenu] = useState(false);
	const [modalSetting, setModalSetting] = useState({
		...ModalTemplates.ModalEmailVerification,
	});

	const [isLoading, setIsLoading] = useState(false);
	const [msgError, setMsgError] = useState(null);

	function handleOpenMenu() {
		setOpenMenu(!openMenu);
	}

	return (
		<>
			<header>
				<Modal {...modalSetting} />
				{currentUser && (
					<div>
						<div className="p-4 border-b-2 border-yellow-600 md:flex md:items-center md:justify-between">
							<div className="flex items-center">
								<IconContext.Provider
									value={{
										className: "m-3 text-onyx-700 text-4xl md:text-2xl",
									}}
								>
									<GiHamburgerMenu onClick={handleOpenMenu} />
								</IconContext.Provider>
								<span className="text-xl text-yellow-600">SanFelipe</span>
								<span className="font-light text-2xl text-onyx-700">
									Acumuladores
								</span>
							</div>
						</div>
						<SideMenu show={openMenu} />
					</div>
				)}
				{!currentUser && (
					<div className="flex items-center justify-between p-4 border-b-2 border-yellow-600">
						<Link className="font-emphasis" to="/">
							<span className="text-xl text-yellow-600">SanFelipe</span>
							<span className="font-light text-2xl text-blue-900">
								Acumuladores
							</span>
						</Link>
					</div>
				)}
			</header>
			{isLoading && <LoadingBar />}
			{msgError && (
				<p className="mt-2 text-sm p-2 text-white bg-red-700">{msgError}</p>
			)}
		</>
	);
};

export default Header;
