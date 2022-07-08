import { Avatar, AvatarProps } from "@material-ui/core";
import clsx from "clsx";
import React from "react";

import { useStyles } from "@sharedComponents/components/IDAvatar/IDAvatar.style";

export interface IIDAvatarProps extends AvatarProps {
	size?: "small" | "medium" | "large";
	width?: number;
	height?: number;
}

export const IDAvatar: React.FC<IIDAvatarProps> = (props: IIDAvatarProps) => {
	const { size = "medium", width = 0, height = 0, ...rest } = props;
	const classes = useStyles({ width, height });

	return (
		<Avatar
			className={clsx({
				[classes[size]]: !(!!width || !!height),
				[classes.avatar]: !!width || !!height,
			})}
			alt="IDAvatar"
			{...rest}
		/>
	);
};
