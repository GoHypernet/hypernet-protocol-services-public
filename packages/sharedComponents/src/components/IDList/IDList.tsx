import { List as MuiList } from "@material-ui/core";
import React from "react";

import { useStyles } from "@sharedComponents/components/IDList/IDList.style";

interface IIDListProps {
	children?: React.ReactNode;
	style?: React.CSSProperties;
}

export const IDList: React.FC<IIDListProps> = (props: IIDListProps) => {
	const { children, style } = props;
	const classes = useStyles();
	return (
		<MuiList
			className={classes.list}
			{...(style && {
				style,
			})}
		>
			{children}
		</MuiList>
	);
};
