import { Schema, model } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

/**
 * @description : content creating instruction
 * @azanCountdown : {"org":"org id","type":"azanCountdown","startTime":"05"} note: startTime is before of azan time
 * @azan : {"org":"org id","type":"azan","startTime":"05"} note: startTime is azan stay time
 * @iqomahCountdown : {"org":"org id","type":"iqomahCountdown","startTime":"05"} note: startTime is iqomahCountdown stay time
 * @iqomah : {"org":"org id","type":"iqomah","startTime":"05"} note: startTime is iqomah stay time
 * @salatPrepareDuration : {"org":"org id","type":"salatPrepareDuration","startTime":"05"}  note: startTime is salat preparation duration time 
 * @prepareSalatSlide : {"org":"org id","type":"prepareSalatSlide","src":"image||"video"} 
 * @prayerTime : {"org":"org id","type":"prayerTime","startTime":"05"}  note: startTime is prayerTime duration time 
 * @salat : {"org":"org id","type":"salat","startTime":"05"} note: starTime is duration of salat time
 * @slide : {"org":"org id","type":"slide",'Waqto':"ASAR" }
 */

const schema = new Schema(
  {
    org: { type: Schema.Types.ObjectId, required: true, ref: 'Organization' },
    type: {
      type: String,
      required: true,
      enum: ['azanCountdown', 'azan', 'iqomahCountdown', 'iqomah', 'salatPrepareDuration', 'prepareSalatSlide', 'prayerTime', 'salat', 'slide', 'khutbah', 'syurukCountDown', 'syurukMain', 'syurukEnd', 'salatSlide'],
    },
    slideType: { type: String, default: '' },
    src: { type: String },
    audioSrc: { type: String },
    zone: { type: String },
    data: [{ hijri: String, date: String, day: String, imsak: String, fajr: String, syuruk: String, dhuhr: String, asr: String, maghrib: String, isha: String }],
    startTime: { type: Number },
    endTime: { type: Number },
    waqto: { type: String, enum: ['SUBUH', 'SYURUK', 'ZOHOR', 'ASAR', 'MAGHRIB', 'ISYAK'] },
    layout: { type: String, default: 'one', enum: ['one', 'two', 'three'] },
    days: [Number],
    dateRange: [String],
    fileName: { type: String },
    audioFileName: { type: String },
    slidePhotos: { type: Array },
    eventName: { type: String, default: '' },
  },
  { timestamps: true }
);
schema.plugin(paginate);

export default model('Contents', schema);
