import { Radio, RadioProps } from "@material-ui/core";
import React from "react";

import { useStyles } from "@sharedComponents/components/IDRadio/IDRadio.style";

interface IDRadioProps extends RadioProps {}

export const IDRadio: React.FC<IDRadioProps> = (props: IDRadioProps) => {
	const classes = useStyles();
	return (
		<Radio
			disableRipple
			className={classes.root}
			icon={<span className={classes.icon} />}
			checkedIcon={
				<span className={`${classes.icon} ${classes.checkedIcon}`} />
			}
			{...props}
		/>
	);
};
