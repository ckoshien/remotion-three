import {staticFile, interpolate, useCurrentFrame} from 'remotion';
import {getVideoMetadata, VideoMetadata} from '@remotion/media-utils';
import {ThreeCanvas, useVideoTexture} from '@remotion/three';
import React, {useEffect, useRef, useState} from 'react';
import {AbsoluteFill, useVideoConfig, Video} from 'remotion';
import {z} from 'zod';
import {zColor} from '@remotion/zod-types';
import {loadFont as loadLato} from '@remotion/google-fonts/Lato';
import {loadFont as loadPoppins} from '@remotion/google-fonts/Poppins';
const {fontFamily: lato} = loadLato();
const {fontFamily: poppins} = loadPoppins();

const container: React.CSSProperties = {
	backgroundColor: 'green',
};

const videoStyle: React.CSSProperties = {
	position: 'absolute',
	opacity: 0,
};

export const myCompSchema = z.object({
	phoneColor: zColor(),
	deviceType: z.enum(['phone', 'tablet']),
});

type MyCompSchemaType = z.infer<typeof myCompSchema>;

export const Scene: React.FC<
	{
		baseScale: number;
	} & MyCompSchemaType
> = ({baseScale, phoneColor, deviceType}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const [videoData, setVideoData] = useState<VideoMetadata | null>(null);

	const videoSrc =
		deviceType === 'phone' ? staticFile('phone.mp4') : staticFile('tablet.mp4');

	useEffect(() => {
		getVideoMetadata(videoSrc)
			.then((data) => setVideoData(data))
			.catch((err) => console.log(err));
	}, [videoSrc]);

	const entranceRotation = interpolate(frame, [0, 1], [-Math.PI, Math.PI*2]);

	// const texture = useVideoTexture(videoRef);
	return (
		<>
			<AbsoluteFill style={container}>
				<Video ref={videoRef} src={videoSrc} style={videoStyle} />
				{videoData ? (
					<ThreeCanvas linear width={width} height={height}>
						<ambientLight intensity={1.5} color={0xffffff} />
						<pointLight position={[10, 10, 0]} />
						{/* <Phone
							phoneColor={phoneColor}
							baseScale={baseScale}
							videoTexture={texture}
							aspectRatio={videoData.aspectRatio}
						/> */}
					</ThreeCanvas>
				) : null}
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					marginTop: 300,
					backgroundImage:
						'repeating-linear-gradient(-45deg, black, gray 15px, black 15px, gray 15px)',
					color: 'green',
					fontFamily: lato,
					fontSize: 140,
					textAlign: 'center',
					height: 160,
					fontWeight: '900',
					width: 640,
				}}
			>
				INNING
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					marginLeft: 640,
					marginTop: -80,
					color: 'black',
					fontFamily: poppins,
					fontSize: 640,
					textAlign: 'center',
					height: 720,
					fontWeight: '900',
					width: 640,
					transform: `rotateY(${entranceRotation}deg)`,
				}}
			>
				9
			</AbsoluteFill>
		</>
	);
};
