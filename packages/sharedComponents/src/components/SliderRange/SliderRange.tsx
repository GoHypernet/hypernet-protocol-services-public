import { SliderProps, Tooltip } from "@material-ui/core";
import React from "react";

import { CustomSlider } from "@sharedComponents/components/SliderRange/SliderRange.style";

export const SliderRange: React.FC<SliderProps> = (props: SliderProps) => {
	const ThumbComponent = (props: any) => (
		<Tooltip
			enterTouchDelay={0}
			placement="top"
			title={props["aria-valuenow"]}
		>
			<span {...props}>
				<span className="bar" />
				<span className="bar" />
				<span className="bar" />
			</span>
		</Tooltip>
	);

	return <CustomSlider {...props} ThumbComponent={ThumbComponent} />;
};
