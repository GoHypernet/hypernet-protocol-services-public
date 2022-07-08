import { Breadcrumbs as MuiBreadcrumbs, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { Box } from "@material-ui/core";

import { useStyles } from "@sharedComponents/components/IDBreadcrumbs/IDBreadcrumbs.style";

export interface IIDBreadcrumbs {
	breadCrumbItems: IBreadcrumbItem[];
}

export interface IBreadcrumbItem {
	label: string;
	href?: string;
	icon?: React.ReactNode;
}

export const IDBreadcrumbs: React.FC<IIDBreadcrumbs> = ({
	breadCrumbItems,
}: IIDBreadcrumbs) => {
	const classes = useStyles();

	return (
		<MuiBreadcrumbs aria-label="breadcrumb" className={classes.wrapper}>
			{breadCrumbItems.map((item, index) =>
				index === breadCrumbItems.length - 1 ? (
					<Typography key={index} color="textPrimary">
						{item.label}
					</Typography>
				) : (
					<Link
						key={index}
						className={classes.link}
						to={item.href || ""}
					>
						{item.icon && (
							<Box className={classes.iconWrapper}>
								{item.icon}
							</Box>
						)}
						{item.label}
					</Link>
				),
			)}
		</MuiBreadcrumbs>
	);
};
