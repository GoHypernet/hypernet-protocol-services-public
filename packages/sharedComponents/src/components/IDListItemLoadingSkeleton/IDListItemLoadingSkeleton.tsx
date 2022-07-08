import { ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";

import { useStyles } from "@sharedComponents/components/IDListItemLoadingSkeleton/IDListItemLoadingSkeleton.style";

interface IIDListItemLoadingSkeletonProps {
	divider?: boolean;
}

export const IDListItemLoadingSkeleton: React.FC<
	IIDListItemLoadingSkeletonProps
> = (props: IIDListItemLoadingSkeletonProps) => {
	const { divider } = props;
	return (
		<ListItem divider={divider}>
			<ListItemAvatar>
				<Skeleton
					animation="wave"
					variant="circle"
					width={36}
					height={36}
				/>
			</ListItemAvatar>
			<ListItemText>
				<Skeleton
					animation="wave"
					height={10}
					width="40%"
					style={{
						marginBottom: 3,
					}}
				/>
				<Skeleton animation="wave" height={12} width="100%" />
				<Skeleton animation="wave" height={12} width="100%" />
			</ListItemText>
		</ListItem>
	);
};
