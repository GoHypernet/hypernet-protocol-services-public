import { Box, Typography } from "@material-ui/core";
import React from "react";

import { IDBreadcrumbs, IBreadcrumbItem } from "@sharedComponents/components";
import { useStyles } from "@sharedComponents/components/IDPageWrapper/IDPageWrapper.style";

interface IIDPageWrapper {
	children: React.ReactNode;
	label?: string;
	description?: string;
	rightContent?: React.ReactNode;
	breadcrumbItems?: IBreadcrumbItem[];
}

export const IDPageWrapper: React.FC<IIDPageWrapper> = ({
	children,
	label,
	rightContent,
	description,
	breadcrumbItems,
}: IIDPageWrapper) => {
	const classes = useStyles();

	return (
		<Box className={classes.wrapper}>
			{breadcrumbItems && (
				<Box className={classes.breadCrumbs}>
					<IDBreadcrumbs breadCrumbItems={breadcrumbItems} />
				</Box>
			)}
			<Box className={classes.topWrapper}>
				{label && (
					<Box className={classes.titleWrapper}>
						<Typography variant="h1" color="textPrimary">
							{label}
						</Typography>
						{rightContent}
					</Box>
				)}
				{description && (
					<Box className={classes.description}>
						<Typography variant="body1" color="textPrimary">
							{description}
						</Typography>
					</Box>
				)}
			</Box>
			{children}
		</Box>
	);
};
