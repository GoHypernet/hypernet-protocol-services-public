import moment from "moment";
import { UnixTimestamp } from "@hypernetlabs/objects";

export class TimeUtils {
	static fromNow = (time: UnixTimestamp) => {
		moment.updateLocale("en", {
			relativeTime: {
				future: "%s left",
				past: "%s ago",
				s: "Seconds",
				ss: "%ss",
				m: "One Minute",
				mm: "%d Minutes",
				h: "One Hour",
				hh: "%d Hours",
				d: "One Day",
				dd: "%d Days",
				M: "One Month",
				MM: "%d Months",
				y: "One Year",
				yy: "%d Years",
			},
		});

		return moment.unix(time).fromNow();
	};
}
