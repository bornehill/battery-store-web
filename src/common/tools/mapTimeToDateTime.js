import parse from "date-fns/parse";
import setDay from "date-fns/setDay";
import getHours from "date-fns/getHours";

export function mapTimeToDateTime(list) {
	return list.map((item) => {
		return Object.assign({}, item, {
			dateStamp: parse(item.time, "HH:mm", new Date()),
		});
	});
}

export function mapTimeToDateByWeekDay(list) {
	return list.map((item) => {
		return Object.assign({}, item, {
			dateStamp: setDay(parse(item.time, "HH:mm", new Date()), item.weekDay),
		});
	});
}

export function mapTimeToDayHour(list) {
	return list.map((item) => {
		return Object.assign({}, item, {
			hour: getHours(parse(item.time, "HH:mm", new Date())),
		});
	});
}
