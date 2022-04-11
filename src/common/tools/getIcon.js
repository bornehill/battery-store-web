import React from "react";
import { AiFillEdit, AiFillShop, AiFillSetting } from "react-icons/ai";
import {
	FaUserCircle,
	FaCashRegister,
	FaStore,
	FaClipboardList,
} from "react-icons/fa";
import { SiBrandfolder } from "react-icons/si";
import { MdLocationOn } from "react-icons/md";

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
		case "FaStore":
			return <FaStore />;
		case "FaClipboardList":
			return <FaClipboardList />;
		case "SiBrandfolder":
			return <SiBrandfolder />;
		case "MdLocationOn":
			return <MdLocationOn />;
		default:
			return <FaUserCircle />;
	}
}
