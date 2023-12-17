import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native';
import { stopSlide } from '../../../rtk/features/navigation/navigationSlice';
import AudioCom from '../../Audio/AudioCom';
import ImageBackground from '../../ImageBackground/ImageBackground';
import { baseUrl } from '../../../constants/constants';
import { EVENT_NAME_SIZE, MARGIN, TEXT_SIZE, TIME_NAME_SIZE } from '../constants';
import { COLORS } from '../../../constants/colors';

let interval;
let timeoutEventcountdown;
const intervalDuration = 1000;

export function EventCountdown({ uri, audio, duration, eventName, endDate: date }) {
  const [time, setTime] = useState([]);
  const [timeName, setTimeName] = useState([]);
  const colors = useSelector((state) => state.theme.colors);
  const dispatch = useDispatch();
  const endDate = new Date(date);

  useEffect(() => {
    dispatch(stopSlide(true));

    timeoutEventcountdown = setTimeout(() => {
      dispatch(stopSlide(false));
    }, duration);
    interval = setInterval(timeCalculate, intervalDuration);
    return () => { clearInterval(interval); clearTimeout(timeoutEventcountdown); };
  }, []);

  function timeCalculate() {
    const now = new Date();

    const timeDiff = endDate.getTime() - now.getTime();
    let seconds = timeDiff / 1000;

    const days = Math.floor(seconds / (24 * 3600));
    seconds %= (24 * 3600);

    // Calculate hours
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    // Calculate minutes
    const minutes = Math.floor(seconds / 60);

    // Calculate remaining seconds
    seconds = Math.floor(seconds % 60);

    let result;
    let name;
    if (days > 0) {
      result = `${days.toString().padStart(2, '0')}-${hours.toString().padStart(2, '0')}`;
      name = 'HARI-JAM';
    } else if (hours > 0) {
      result = `${hours.toString().padStart(2, '0')}-${minutes.toString().padStart(2, '0')}`;
      name = 'JAM-MINIT';
    } else {
      result = `${minutes.toString().padStart(2, '0')}-${seconds.toString().padStart(2, '0')}`;
      name = 'MINIT-SAAT';
    }

    if (timeDiff > 0) {
      setTime(result.split('-'));
      setTimeName(name.split('-'));
    } else {
      setTime(['00', '00']);
      setTimeName(['MINIT', 'SAAT']);
      clearInterval(interval);
    }
  }

  if (time.length > 0 && timeName.length > 0) {
    return (
      <>
        {audio && <AudioCom src={audio} />}
        <ImageBackground source={{ uri: baseUrl + uri }}>
          <View style={[styles.container, { backgroundColor: uri ? null : colors.eventBg || '#ffcc007d' }]}>
            <Text style={[styles.eventName, { color: colors?.eventFontColor || '#000' }]}>
              {eventName}
            </Text>
            <View style={styles.timeBody}>
              <View style={[styles.textBody]}>
                <Text style={[{ color: colors.eventTimerFontColor || '#fff', backgroundColor: colors?.eventFontHighlightColor || COLORS.black }, styles.time]}>
                  {time[0]}
                </Text>
                <Text style={[{ color: colors.eventTimerFontColor || '#fff', backgroundColor: colors?.eventFontHighlightColor || COLORS.black }, styles.timeName]}>
                  {timeName[0]}
                </Text>
              </View>
              <View style={[styles.textBody]}>
                <Text style={[{ color: colors.eventTimerFontColor || '#fff', backgroundColor: colors?.eventFontHighlightColor || COLORS.black }, styles.time]}>
                  {time[1]}
                </Text>
                <Text style={[{ color: colors.eventTimerFontColor || '#fff', backgroundColor: colors?.eventFontHighlightColor || COLORS.black }, styles.timeName]}>
                  {timeName[1]}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>

      </>
    );
  }
}

const styles = StyleSheet.create({
  time: {
    fontSize: TEXT_SIZE,
    fontWeight: 'bold',
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  timeName: {
    fontSize: TIME_NAME_SIZE,
    fontWeight: 'bold',
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textBody: {
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5,
  },
  timeBody: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 20,
  },
  eventName: {
    fontSize: EVENT_NAME_SIZE,
    fontWeight: 'bold',
    marginTop: -MARGIN,
    marginBottom: MARGIN,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
