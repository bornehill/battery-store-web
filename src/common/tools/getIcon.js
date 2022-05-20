import React from "react";
import {
	AiFillEdit,
	AiFillShop,
	AiFillSetting,
	AiOutlineBook,
} from "react-icons/ai";
import {
	FaBookReader,
	FaUnlockAlt,
	FaUserCircle,
	FaCashRegister,
	FaClipboardList,
	FaFileInvoiceDollar,
	FaRegCreditCard,
	FaStore,
	FaTools,
	FaUsersCog,
} from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { MdLocationOn, MdPeople } from "react-icons/md";

export function getIcon(icon) {
	switch (icon) {
		case "AiFillEdit":
			return <AiFillEdit />;
		case "AiFillShop":
			return <AiFillShop />;
		case "AiFillSetting":
			return <AiFillSetting />;
		case "FaCashRegister":
			return <FaCashRegister />;
		case "FaFileInvoiceDollar":
			return <FaFileInvoiceDollar />;
		case "FaStore":
			return <FaStore />;
		case "FaClipboardList":
			return <FaClipboardList />;
		case "SiBrandfolder":
			return <SiBrandfolder />;
		case "MdLocationOn":
			return <MdLocationOn />;
		case "MdPeople":
			return <MdPeople />;
		case "AiOutlineBook":
			return <AiOutlineBook />;
		case "FaBookReader":
			return <FaBookReader />;
		case "FaRegCreditCard":
			return <FaRegCreditCard />;
		case "FaUsersCog":
			return <FaUsersCog />;
		case "FaUnlockAlt":
			return <FaUnlockAlt />;
		case "FaTools":
			return <FaTools />;
		default:
			return <FaUserCircle />;
	}
}
