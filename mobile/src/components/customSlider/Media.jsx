import { YoutubeCom } from './media/Youtube';
import { VideoCom } from './media/Video';
import { ImageCom } from './media/Image';
import { EventCountdown } from './media/EventCountdown';

// conditional render  component
export function Media({ src, type, audio, duration, eventName, endDate }) {
  const mediaTypes = {
    youtube: <YoutubeCom uri={src} audio={audio} duration={duration} />,
    image: <ImageCom uri={src} audio={audio} duration={duration} />,
    video: <VideoCom uri={src} audio={audio} duration={duration} />,
    eventCountdown: <EventCountdown uri={src} audio={audio} duration={duration} eventName={eventName} endDate={endDate} />,
  };
  return mediaTypes[type];
}
