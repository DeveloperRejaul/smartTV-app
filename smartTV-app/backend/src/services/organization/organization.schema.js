import { Schema, model, } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
const url = 'https://img.freepik.com/free-photo/moon-light-shine-through-window-into-islamic-mosque-interior_1217-2597.jpg?w=826&t=st=1692793241~exp=1692793841~hmac=bb230356aea728bbbc8a4a433997d109df29f69c8584b0a2ca90301bba6d9bb7';
const schema = new Schema({
  avatar: { type: String, default: url },
  name: { type: String, required: true, unique: true },
  location: { type: String },
  timezone: { type: String, required: true },
  timeFormat: { type: String, required: true, enum: ['12', '24'] },
  template: { type: String, enum: ['one', 'two', 'three'], default: 'one' },
  mute: { type: Boolean, default: false },
  sleepingDate: { type: Array, default: [] },
  sleepingDay: [{ day: String, start: { type: String }, end: { type: String }, _id: false }],
  runningText: { type: String, default: '' },
  runningTextShow: { type: Boolean, default: true },
  blinksBeforeAzan: { type: Number, default: 5 },
  theme: {
    colors: {
      solatBg: { type: String, default: '#FFFFFF' },
      solatFontColor: { type: String, default: '#000000' },
      activeSolatBg: { type: String, default: '#560d0d' },
      activeSolatFontColor: { type: String, default: '#FFFFFF' },
      nextSolatBg: { type: String, default: '#5c0464' },
      nextSolatFontColor: { type: String, default: '#FFFFFF' },
      hijriDateFontColor: { type: String, default: '#C10606' },
      runningTextBg: { type: String, default: '#C10606' },
      runningTextFontColor: { type: String, default: '#FFFFFF' },
      eventBg: { type: String, default: '#FFCD6F' },
      eventFontColor: { type: String, default: '#000000' },
      eventFontHighlightColor: { type: String, default: '#000000' },
      eventTimerFontColor: { type: String, default: '#FFFFFF' },

    },
    fonts: {
      solatTimeFont: { type: String, default: 'Poppins-Medium' },
      activeSolatTimeFont: { type: String, default: 'Poppins-Medium' },
      nextSolatTimeFont: { type: String, default: 'Poppins-Medium' },
      hijriDateFont: { type: String, default: 'Poppins-Medium' },
    }


  },
  offset: {
    fajr: { type: Number, default: 0 },
    syuruk: { type: Number, default: 0 },
    dhuhr: { type: Number, default: 0 },
    asr: { type: Number, default: 0 },
    maghrib: { type: Number, default: 0 },
    isha: { type: Number, default: 0 },
  },
  screen: {
    khutbahProgress: { type: Boolean, default: true },
    iqomahCountdown: { type: Boolean, default: true },
    salatScreen: { type: Boolean, default: true },
  },
  adjustment: {
    hijridate: { type: Number, default: 0 }
  }
}, { timestamps: true });

schema.plugin(paginate);
export default model('Organization', schema);
