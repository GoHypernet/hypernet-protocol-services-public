import { UrlString } from "@hypernetlabs/hypernet.id-objects";
import {
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListItemSecondaryAction,
} from "@material-ui/core";
import React from "react";

import { IDAvatar, IDTypography } from "@sharedComponents/components";
import { useStyles } from "@sharedComponents/components/IDListItem/IDListItem.style";

interface IIDListItemProps {
	primaryText: string;
	divider?: boolean;
	avatarSrc?: UrlString;
	category?: string;
	rightContent?: React.ReactNode;
}

export const IDListItem: React.FC<IIDListItemProps> = (
	props: IIDListItemProps,
) => {
	const { primaryText, divider, avatarSrc, category, rightContent } = props;
	const classes = useStyles();

	return (
		<ListItem divider={divider}>
			{avatarSrc && (
				<ListItemAvatar>
					<IDAvatar size="small" src={avatarSrc} />
				</ListItemAvatar>
			)}
			<ListItemText>
				<IDTypography customVariant="link">{category}</IDTypography>
				<IDTypography variant="body2">{primaryText}</IDTypography>
			</ListItemText>
			<ListItemSecondaryAction>{rightContent}</ListItemSecondaryAction>
		</ListItem>
	);
};
