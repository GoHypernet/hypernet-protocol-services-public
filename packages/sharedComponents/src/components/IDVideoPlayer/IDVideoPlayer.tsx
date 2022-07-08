import React, { useEffect, useMemo } from "react";

import { useStyles } from "@sharedComponents/components/IDVideoPlayer/IDVideoPlayer.style";

interface IIDVideoPlayer {
	src: string;
	autoPlay?: boolean;
	allowFullScreen?: boolean;
	hideControls?: boolean;
	height?: string;
	width?: string;
	isYouTubeVideo?: boolean;
	className?: string;
}

export const IDVideoPlayer: React.FC<IIDVideoPlayer> = ({
	src,
	autoPlay,
	hideControls,
	allowFullScreen = true,
	height = "100%",
	width = "100%",
	isYouTubeVideo,
	className,
}: IIDVideoPlayer) => {
	const classes = useStyles();
	const urlSrc = useMemo(() => new URL(src), [src]);

	useEffect(() => {
		if (isYouTubeVideo) {
			urlSrc.searchParams.set("autoplay", autoPlay ? "1" : "0");
			urlSrc.searchParams.set("controls", hideControls ? "0" : "1");
			urlSrc.searchParams.set("rel", "0");
			urlSrc.searchParams.set("showinfo", "0");
			urlSrc.searchParams.set("modestbranding", "1");
			urlSrc.searchParams.set("playsinline", "1");
		}
	}, [isYouTubeVideo, autoPlay, hideControls]);

	return (
		<iframe
			className={`${classes.iframe} ${className}`}
			width={width}
			height={height}
			src={urlSrc.href}
			allowFullScreen={allowFullScreen}
		/>
	);
};
