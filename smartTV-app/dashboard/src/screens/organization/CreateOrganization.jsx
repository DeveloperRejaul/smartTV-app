import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateNewLay from '../../layout/CreateNew/CreateNewLay';
import TextInput from '../../components/textInput/TextInput';
import Dropdown from '../../components/dropdown/Dropdown';
import timeZoneList from '../../constants/timezone.json';
import {
  useCreateOrgMutation,
  useUpdateOrgMutation,
} from '../../rtk/features/api/org.api';
import { defaultImage } from '../../assets';
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker';
import { cleanEmptyObjValue, handleOrgSleepingTv } from '../../utils/utils.fn';
import ColorPicker from '../../components/colorPicker/ColorPicker';
import FontChooser from '../../components/FontChooser/FontChooser';
import { FONT_DATA } from '../../utils/fontData';
import AdjustableInput from '../../components/AdjustableInput/AdjustableInput';
import arrowRight from '../../assets/svg-icon/arrow-right.svg';
import Toggle from '../../components/Toggle/Toggle';
import umalqura from '@umalqura/core';
import Loading from '../../components/Loading';
import { navPath } from '../../constants/navPath';

function CreateOrganization() {
  const { register, handleSubmit, setValue, setError, clearErrors, formState: { errors } } = useForm();
  const [sleepingDate, setSleepingDate] = useState([]);
  // const [mute, setMute] = useState(false);
  const [btnType, setBtnType] = useState('Save');
  const [timeZone, setTimeZone] = useState('');
  const [timeFormat, setTimeFormat] = useState('');
  const [file, setFile] = useState('');
  const { state } = useLocation();
  document.title=`${import.meta.env.VITE_APP_TITLE} | ${state? 'UPDATE ORGANIZATION': 'CREATE ORGANIZATION'}`;
  const [updateOrg, { isLoading: updating }] = useUpdateOrgMutation();
  const [createOrg, { isLoading: creating, isSuccess, isLoading }] = useCreateOrgMutation();
  const [activeTab, setActiveTab] = useState('');
  // let toggleTime;
  const [hijriDate, setHijriDate] = useState(state?.adjustment?.hijridate || 0);
  const [hijriDisplay, setHijriDisplay] = useState({});
  const navigate = useNavigate();
  const zoneRef = useRef(null);
  const formatRef = useRef(null);
  const dayRef = useRef(null);
  const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  useEffect(() => {
    if (state) {
      setTimeFormat(state?.timeFormat);
      setTimeZone(state?.timeZone);
      setBtnType('Update');
      setValue('mute', state?.mute);
      setValue('runningTextShow', state?.runningTextShow);
      setValue('name', state?.name);
      setValue('location', state?.location);
      setValue('runningText', state?.runningText);
      setValue('adjustment.hijridate', state?.adjustment?.hijridate || 0);
      setValue('screen', state?.screen);
      setValue('theme', state?.theme);
      state?.sleepingDay?.map((d) => {
        if (d.day === '0') setValue('sunStartTime', d.start), setValue('sunEndTime', d.end);
        if (d.day === '1') setValue('monStartTime', d.start), setValue('monEndTime', d.end);
        if (d.day === '2')setValue('tueStartTime', d.start), setValue('tueEndTime', d.end);
        if (d.day === '3') setValue('wedStartTime', d.start), setValue('wedEndTime', d.end);
        if (d.day === '4') setValue('thuStartTime', d.start), setValue('thuEndTime', d.end);
        if (d.day === '5') setValue('friStartTime', d.start), setValue('friEndTime', d.end);
        if (d.day === '6') setValue('satStartTime', d.start), setValue('satEndTime', d.end);
      });
    }
  }, []);

  const validateDayTime = (data) => {
    try {
      for (const d of dayName) {
        if (data[d]) {
          const [hours1, minutes1] = data[`${d.substring(0, 3)}StartTime`]?.split(':')?.map(Number);
          const [hours2, minutes2] = data[`${d.substring(0, 3)}EndTime`]?.split(':')?.map(Number);
          const totalMinutes1 = hours1 * 60 + minutes1;
          const totalMinutes2 = hours2 * 60 + minutes2;
          if (totalMinutes1 > totalMinutes2) {
            return {
              name: d,
              message: { message: 'End time must be greater than start time' },
            };
          }
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    const fromData = new FormData();
    const times = handleOrgSleepingTv(data);
    if (timeZone==='') {
      zoneRef.current.focus();
      setError('timezone', { message: 'Select a time zone' });
      return;
    }
    if (timeFormat==='') {
      setError('timeFormat', { message: 'Select time format' });
      formatRef.current.focus();
      return;
    }
    const valresult = validateDayTime(data);
    if (valresult) {
      setError(valresult?.name, valresult?.message);
      dayRef.current.focus();
      return;
    }

    if (btnType.toLowerCase() === 'update') {
      const newData = cleanEmptyObjValue({
        name: data?.name,
        location:
          data?.location === null ||
          data?.location === undefined ||
          data?.location === ''
            ? timeZone?.split(':')[1] ||
              timeZoneList.timezone
                .find((t) => t.startsWith(timeZone))
                .split(':')[1]
            : data?.location,
        timezone: timeZone?.split(':')[0],
        timeFormat,
        sleepingDate,
        sleepingDay: times,
        runningText: data.runningText,
        runningTextShow: data?.runningTextShow,
        mute: data?.mute,
        theme: data?.theme,
        offset: data?.offset,
        blinksBeforeAzan: data?.blinksBeforeAzan,
        adjustment: data?.adjustment,
        screen: data.screen,
      });
      newData.runningText = data.runningText;
      if (file) fromData.append('image', file);
      fromData.append('data', JSON.stringify(newData));
      updateOrg({ body: fromData, id: state?.id });
    }

    if (btnType.toLowerCase() === 'save') {
      const newData = cleanEmptyObjValue({
        name: data?.name,
        location:
          data?.location === null ||
          data?.location === undefined ||
          data?.location === ''
            ? timeZone?.split(':')[1]
            : data?.location,
        timezone: timeZone?.split(':')[0],
        timeFormat,
        sleepingDate,
        sleepingDay: times,
        runningText: data.runningText,
        runningTextShow: data?.runningTextShow,
        mute: data?.mute,
        theme: data?.theme,
        offset: data?.offset,
        blinksBeforeAzan: data?.blinksBeforeAzan,
        screen: data?.screen,
        adjustment: data?.adjustment,
      });
      if (file) fromData.append('image', file);
      fromData.append('data', JSON.stringify(newData));
      createOrg(fromData);
    }
  };

  const handleActiveTab = (tab) => {
    if (activeTab === tab) setActiveTab('');
    else setActiveTab(tab);
  };
  const handleOnOff = (type, e) => {
    setValue(`screen.${type}`, e);
  };

  useEffect(() => {
    try {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + hijriDate);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const day = currentDate.getDate();
      const hijri = umalqura(new Date(year, month, day));
      setHijriDisplay({ d: hijri?.hd, m: hijri?.hm, y: hijri?.hy });
      setValue('adjustment.hijridate', hijriDate);
    } catch (error) {
      //console.log(error);
      toast.error('Use smaller number');
    }
  }, [hijriDate]);

  useEffect(() => {
    if (isSuccess) {
      navigate(navPath.organization);
    }
  }, [isSuccess]);

  if (isLoading) return <Loading />;

  return (
    <CreateNewLay
      titleLeft='Organization Logo'
      title=' Organization'
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-4 py-10'
      selectFile={setFile}
      img={state?.avatar || defaultImage}
      btnText={btnType}
      isLoading={btnType === 'Save' ? creating : updating}
      isCreate={!state}
      orgName={state?.name || ''}
      clearErrors={clearErrors}
    >
      <TextInput
        placeholder='Masjid Name'
        label='Masjid Name'
        register={register('name', { required: 'Masjid name is required' })}
        error={errors?.name?.message}
      />
      <TextInput
        placeholder='Location'
        label='Location'
        register={register('location')}
      />

      <div ref={zoneRef} tabIndex={-1}>
        <Dropdown
          label='Time Zone'
          onSelect={(e) => setTimeZone(e)}
          value={timeZone}
          items={timeZoneList.timezone}
          disable={btnType.toLowerCase() === 'update'}
        />
      </div>
      {
        errors?.timezone?.message? <p className='text-error'>{errors?.timezone?.message}</p>:''
      }
      <div ref={formatRef} tabIndex={-2}>
        <Dropdown
          label='Time Format'
          items={['12', '24']}
          value={timeFormat}
          onSelect={(e) => setTimeFormat(e)}
        />
      </div>
      {
        errors?.timeFormat?.message? <p className='text-error'>{errors?.timeFormat?.message}</p>:''
      }

      <div>
        <div className=' flex  flex-col sm:flex-row gap-5 pb-2 sm:items-center'>
          <p className='min-w-[100px]'>Running Text</p>
          <p className='hidden sm:block'>:</p>
          <div className='w-fit'>
            <Toggle
              name='runningTextShow'
              defaultValue={state?.runningTextShow}
              callBack={(type, val) => setValue(type, val)}
              label1='Hide'
              label2='Show'
              width='w-[60px]'
            />
          </div>
        </div>
        <textarea
          className='w-full focus:outline-0 font-NunitoSans border-2 border-tints-50 rounded-lg px-3 py-1'
          {...register('runningText')}
        />
      </div>

      {/* handle video audio mute and unmute  */}
      <div className=' flex flex-col sm:flex-row gap-5 pb-2 sm:items-center'>
        <label htmlFor='Mute Unmute' className='min-w-[10px]'>
          Mute/ Unmute
        </label>
        <p className='hidden sm:block'>:</p>
        <div className='w-fit'>
          <Toggle
            name='mute'
            defaultValue={state?.mute}
            callBack={(type, val) => setValue(type, val)}
            label1='Unmute'
            label2='Mute'
            width='w-[80px]'
          />
        </div>
      </div>
      <div>
        <p className='mb-2 mt-6'>Select tv sleeping time</p>
        <DateRangePicker
          value={(state?.sleepingDate[0]!=='' && state?.sleepingDate[1]!=='')? state?.sleepingDate : null}
          onChange={(e) => {
            setSleepingDate(e);
          }}
        />
        {/* Wednesday */}
        {sleepingDate[0] !== '' && (
          <>
            <TimeRange
              reg={register('sunday')}
              name='sunday'
              reg1={register('sunStartTime')}
              reg2={register('sunEndTime')}
              defaultValue={!state?.sleepingDay.find((d) => d.day === '0')}
              errors={errors.sunday}
            />
            <TimeRange
              reg={register('monday')}
              name='monday'
              reg1={register('monStartTime')}
              reg2={register('monEndTime')}
              defaultValue={!state?.sleepingDay.find((d) => d.day === '1')}
              errors={errors.monday}

            />
            <TimeRange
              reg={register('tuesday')}
              name='tuesday'
              reg1={register('tueStartTime')}
              reg2={register('tueEndTime')}
              defaultValue={!state?.sleepingDay.find((d) => d.day === '2')}
              errors={errors.tuesday}
            />
            <span ref={dayRef} tabIndex={-3} />
            <TimeRange
              reg={register('wednesday')}
              name='wednesday'
              reg1={register('wedStartTime')}
              reg2={register('wedEndTime')}
              defaultValue={!state?.sleepingDay.find((d) => d.day === '3')}
              errors={errors.wednesday}

            />
            <TimeRange
              reg={register('thursday')}
              name='thursday'
              reg1={register('thuStartTime')}
              reg2={register('thuEndTime')}
              defaultValue={!state?.sleepingDay.find((d) => d.day === '4')}
              errors={errors.thursday}

            />
            <TimeRange
              reg={register('friday')}
              name='friday'
              reg1={register('friStartTime')}
              reg2={register('friEndTime')}
              defaultValue={!state?.sleepingDay.find((d) => d.day === '5')}
              errors={errors.friday}

            />
            <TimeRange
              reg={register('saturday')}
              name='saturday'
              reg1={register('satStartTime')}
              reg2={register('satEndTime')}
              defaultValue={!state?.sleepingDay.find((d) => d.day === '6')}
              errors={errors.saturday}
            />
          </>
        )}
      </div>
      <h1>Next solat time blinks before azan (in minutes)</h1>
      <AdjustableInput
        min={0}
        setValue={setValue}
        name='blinksBeforeAzan'
        defaultValue={state?.blinksBeforeAzan || 5}
      />

      {/* Theme */}
      <h1 className='border-b pt-10 '>Customization</h1>
      <div className='p-5'>
        <div
          className='flex  gap-4 cursor-pointer border-b pb-5 bg-white'
          onClick={() => handleActiveTab('color')}
        >
          <img
            src={arrowRight}
            alt='Arrow'
            className={`${activeTab === 'color' ? 'rotate-90' : ''}`}
          />
          <h1 className='font-[600]'>Colors</h1>
        </div>
        <div
          className={`${
            activeTab === 'color' ? 'h-fit' : 'h-0 overflow-hidden'
          } duration-700 transition-all bg-white z-10  mt-5`}
        >
          {/* Default BGC  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-1'>
            <h1 className='w-[150px] md:w-[400px]'>Default Background Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={state?.theme?.colors?.solatBg || '#FFFFFF'}
                setValue={setValue}
                name='theme.colors.solatBg'
              />
            </div>
          </div>
          {/* Default Text Color  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-5'>
            <h1 className='w-[150px] md:w-[400px]'>Default Text Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={state?.theme?.colors?.solatFontColor || '#000000'}
                setValue={setValue}
                name='theme.colors.solatFontColor'
              />
            </div>
          </div>
          {/* Active Solat Timing Background Color  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-1'>
            <h1 className='w-[150px] md:w-[400px]'>Active Solat Timing Background Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={state?.theme?.colors?.activeSolatBg || '#424242'}
                setValue={setValue}
                name='theme.colors.activeSolatBg'
              />
            </div>
          </div>
          {/* Active Solat Timing Text Color  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-5'>
            <h1 className='w-[150px] md:w-[400px]'>Active Solat Timing Text Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={
                  state?.theme?.colors?.activeSolatFontColor || '#EEEEEE'
                }
                setValue={setValue}
                name='theme.colors.activeSolatFontColor'
              />
            </div>
          </div>
          {/* Next Solat Timing Background Color  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-1'>
            <h1 className='w-[150px] md:w-[400px]'>Next Solat Timing Background Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={state?.theme?.colors?.nextSolatBg || '#FFF797'}
                setValue={setValue}
                name='theme.colors.nextSolatBg'
              />
            </div>
          </div>
          {/* Next Solat Timing Text Color  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-5'>
            <h1 className='w-[150px] md:w-[400px]'>Next Solat Timing Text Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={
                  state?.theme?.colors?.nextSolatFontColor || '#000000'
                }
                setValue={setValue}
                name='theme.colors.nextSolatFontColor'
              />
            </div>
          </div>
          {/* Hijri Date Text Color  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-5'>
            <h1 className='w-[150px] md:w-[400px]'>Hijri Date Text Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={
                  state?.theme?.colors?.hijriDateFontColor || '#C10606'
                }
                setValue={setValue}
                name='theme.colors.hijriDateFontColor'
              />
            </div>
          </div>
          {/* Running Text background Color  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-1'>
            <h1 className='w-[150px] md:w-[400px]'>Running Text background Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={state?.theme?.colors?.runningTextBg || '#C10606'}
                setValue={setValue}
                name='theme.colors.runningTextBg'
              />
            </div>
          </div>
          {/* Running Text Font Color  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-5'>
            <h1 className='w-[150px] md:w-[400px]'>Running Text Font Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={
                  state?.theme?.colors?.runningTextFontColor || '#FFFFFF'
                }
                setValue={setValue}
                name='theme.colors.runningTextFontColor'
              />
            </div>
          </div>
          {/* Event Countdown Background Color  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-1'>
            <h1 className='w-[150px] md:w-[400px]'>Event Countdown Background Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={state?.theme?.colors?.eventBg || '#FFCD6F'}
                setValue={setValue}
                name='theme.colors.eventBg'
              />
            </div>
          </div>
          {/* Event Countdown Font Highlighting Color  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-1'>
            <h1 className='w-[150px] md:w-[400px]'>Event Countdown Font Highlighting Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={
                  state?.theme?.colors?.eventFontHighlightColor || '#000000'
                }
                setValue={setValue}
                name='theme.colors.eventFontHighlightColor'
              />
            </div>
          </div>
          {/* Event Countdown Font Color  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-1'>
            <h1 className='w-[150px] md:w-[400px]'>Event Countdown Font Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={state?.theme?.colors?.eventFontColor || '#000000'}
                setValue={setValue}
                name='theme.colors.eventFontColor'
              />
            </div>
          </div>
          {/* Event Countdown Timer Font Color  */}
          <div className='flex flex-col xss:flex-row sm:items-center pb-5'>
            <h1 className='w-[150px] md:w-[400px]'>Event Countdown Timer Font Color</h1>
            <p className='hidden sm:block px-5'>:</p>
            <div className='pt-2 sm:pt-0'>
              <ColorPicker
                color={
                  state?.theme?.colors?.eventTimerFontColor || '#FFFFFF'
                }
                setValue={setValue}
                name='theme.colors.eventTimerFontColor'
              />
            </div>
          </div>

        </div>
        <div
          className='flex  gap-4 cursor-pointer border-b py-5 bg-white'
          onClick={() => handleActiveTab('fonts')}
        >
          <img
            src={arrowRight}
            alt='Arrow'
            className={`${activeTab === 'fonts' ? 'rotate-90' : ''}`}
          />
          <h1 className='font-[600]'>Fonts</h1>
        </div>
        <div
          className={`${
            activeTab === 'fonts' ? 'h-fit' : 'h-0 overflow-hidden'
          } duration-700 transition-all bg-white z-20`}
        >

          <div className='my-10 ml-2'>
            <div className='flex flex-col md:flex-row gap-3 pb-5'>
              <div className='flex items-center gap-1'>
                <div className='w-[100px] md:w-[150px] lg:w-[200px]'>Solat Time Font</div>
                <span>:</span>
              </div>
              <div className=''>
                <FontChooser
                  data={FONT_DATA}
                  setValue={setValue}
                  name='theme.fonts.solatTimeFont'
                  defaultValue={state?.theme?.fonts?.solatTimeFont}
                />
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-3 pb-5'>
              <div className='flex items-center gap-1'>
                <div className='w-[100px] md:w-[150px] lg:w-[200px]'>Active Solat Time Font</div>
                <span>:</span>
              </div>
              <div className=''>
                <FontChooser
                  data={FONT_DATA}
                  setValue={setValue}
                  name='theme.fonts.activeSolatTimeFont'
                  defaultValue={state?.theme?.fonts?.activeSolatTimeFont}
                />
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-3 pb-5'>
              <div className='flex items-center gap-1'>
                <div className='w-[100px] md:w-[150px] lg:w-[200px]'>Next Solat Time Font</div>
                <span>:</span>
              </div>
              <div className=''>
                <FontChooser
                  data={FONT_DATA}
                  setValue={setValue}
                  name='theme.fonts.nextSolatTimeFont'
                  defaultValue={state?.theme?.fonts?.nextSolatTimeFont}
                />
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-3 pb-5'>
              <div className='flex items-center gap-1'>
                <div className='w-[100px] md:w-[150px] lg:w-[200px]'>Hijri Date Font</div>
                <span>:</span>
              </div>
              <div className=''>
                <FontChooser
                  data={FONT_DATA}
                  setValue={setValue}
                  name='theme.fonts.hijriDateFont'
                  defaultValue={state?.theme?.fonts?.hijriDateFont}
                />
              </div>
            </div>

          </div>
        </div>
        <div
          className='flex  gap-4 cursor-pointer border-b py-5'
          onClick={() => handleActiveTab('solatTime')}
        >
          <img
            src={arrowRight}
            alt='Arrow'
            className={`${activeTab === 'solatTime' ? 'rotate-90' : ''}`}
          />
          <h1 className='font-[600]'>Solat Time Adjustment (Minute)</h1>
        </div>
        <div
          className={`${
            activeTab === 'solatTime' ? 'h-fit' : 'h-0 overflow-hidden'
          } duration-700 transition-all bg-white z-30`}
        >
          <table className='my-10'>
            <tbody>
              <tr>
                <td className='text-start'>SUBUH</td>
                <td className='px-1'>:</td>
                <td>
                  <AdjustableInput
                    setValue={setValue}
                    name='offset.fajr'
                    defaultValue={state?.offset?.fajr}
                  />
                </td>
              </tr>
              <tr>
                <td className='text-start'>SYURUK</td>
                <td className='px-1'>:</td>
                <td>
                  <AdjustableInput
                    setValue={setValue}
                    name='offset.syuruk'
                    defaultValue={state?.offset?.syuruk}
                  />
                </td>
              </tr>
              <tr>
                <td className='text-start'>ZOHOR</td>
                <td className='px-1'>:</td>
                <td>
                  <AdjustableInput
                    setValue={setValue}
                    name='offset.dhuhr'
                    defaultValue={state?.offset?.dhuhr}
                  />
                </td>
              </tr>
              <tr>
                <td className='text-start'>ASAR</td>
                <td className='px-1'>:</td>
                <td>
                  <AdjustableInput
                    setValue={setValue}
                    name='offset.asr'
                    defaultValue={state?.offset?.asr}
                  />
                </td>
              </tr>
              <tr>
                <td className='text-start'>MAGRIB</td>
                <td className='px-1'>:</td>
                <td>
                  <AdjustableInput
                    setValue={setValue}
                    name='offset.maghrib'
                    defaultValue={state?.offset?.maghrib}
                  />
                </td>
              </tr>
              <tr>
                <td className='text-start'>ISYAK</td>
                <td className='px-1'>:</td>
                <td>
                  <AdjustableInput
                    setValue={setValue}
                    name='offset.isha'
                    defaultValue={state?.offset?.isha}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          className='flex  gap-4 cursor-pointer border-b py-5 bg-white z-40'
          onClick={() => handleActiveTab('onoff')}
        >
          <img
            src={arrowRight}
            alt='Arrow'
            className={`${activeTab === 'onoff' ? 'rotate-90' : ''}`}
          />
          <h1 className='font-[600]'>Screen On/ Off</h1>
        </div>
        <div
          className={`${
            activeTab === 'onoff' ? 'h-fit' : 'h-0 overflow-hidden'
          } duration-700 transition-all bg-white z-40 `}
        >
          <div className='pt-5 max-w-[800px] w-full'>
            <div className='flex sm:items-center sm:justify-between pb-5 flex-col items-start justify-start sm:flex-row gap-2 sm:gap-5'>
              <h1>Iqomah Countdown Screen</h1>
              <div className='flex gap-1 items-center'>
                <Toggle
                  name='iqomahCountdown'
                  defaultValue={state?.screen?.iqomahCountdown}
                  callBack={(type, e) => handleOnOff(type, e)}
                />
              </div>
            </div>
            <div className='flex sm:items-center sm:justify-between pb-5 flex-col items-start justify-start sm:flex-row gap-2 sm:gap-5'>
              <h1> Khutbah Jumaat in Progress Screen</h1>
              <div className='flex gap-1 items-center'>
                <Toggle
                  name='khutbahProgress'
                  defaultValue={state?.screen?.khutbahProgress}
                  callBack={(type, e) => handleOnOff(type, e)}
                />
              </div>
            </div>
            <div className='flex sm:items-center sm:justify-between pb-5 flex-col items-start justify-start sm:flex-row gap-2 sm:gap-5'>
              <h1>Congregation Praying in Progress Screen (Salat Screen)</h1>
              <div className='flex gap-1 items-center'>
                <Toggle
                  name='salatScreen'
                  defaultValue={state?.screen?.salatScreen}
                  callBack={(type, e) => handleOnOff(type, e)}
                />
              </div>
            </div>
          </div>
        </div>
        <div
          className='flex  gap-4 cursor-pointer border-b py-5 bg-white z-50'
          onClick={() => handleActiveTab('dateAdjustment')}
        >
          <img
            src={arrowRight}
            alt='Arrow'
            className={`${activeTab === 'dateAdjustment' ? 'rotate-90' : ''}`}
          />
          <h1 className='font-[600]'>Date Adjustment</h1>
        </div>
        <div
          className={`${
            activeTab === 'dateAdjustment'
              ? 'h-fit duration-700'
              : 'h-0 overflow-hidden duration-700'
          }  transition-all bg-white z-50`}
        >
          <div className='flex sm:items-center gap-5 flex-col sm:flex-row items-start pt-5'>
            <h1 className='text-start'>Hijri Date Adjustment</h1>
            <div className='flex flex-col gap-3 items-center'>
              <div className='text-xl'>
                {hijriDisplay.d}/{hijriDisplay.m}/{hijriDisplay.y}
              </div>
              <AdjustableInput
                max={365}
                min={-365}
                onChange={(e) => setHijriDate(e)}
                defaultValue={state?.adjustment?.hijridate}
              />
            </div>


          </div>
        </div>
      </div>
    </CreateNewLay>
  );
}
export default CreateOrganization;

// communed element
function TimeRange({ reg, name, reg1, reg2, defaultValue = true, errors=null}) {
  const [select, setSelect] = useState(defaultValue);
  return (
    <div className='w-full'>
      <div className='flex sm:items-center gap-2 py-2 flex-col sm:flex-row'>
        <div className='flex items-center '>
          <input
            type='checkbox'
            {...reg}
            id={name}
            value={name}
            checked={!select}
            className='cursor-pointer mr-2'
            onClick={() => setSelect((pre) => !pre)}
          />
          <label htmlFor={name} className='cursor-pointer w-32'>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </label>
        </div>
        <div className='flex items-center'>
          <div className='scale-90 xss:scale-100'>
            <TextInput type='time' register={reg1} disabled={select} />
          </div>
          <p className='px-2'>to</p>
          <div className='scale-90 xss:scale-100'>
            <TextInput
              type='time'
              placeholder='00:00:00'
              register={reg2}
              disabled={select}
            />
          </div>
        </div>
      </div>
      {errors? <p className='text-error'>{errors?.message}</p>:''}
    </div>
  );
}
