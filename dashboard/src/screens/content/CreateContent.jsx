/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-wrap-multilines */
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Layout01, Layout02, Layout03, Search } from '../../assets/svg-icon';
import DayPicker from '../../components/DayPicker/DayPicker';
import Duration from '../../components/Duration';
import DropDown from '../../components/dropdown/Dropdown';
import TextInput from '../../components/textInput/TextInput';
import { baseUrl, contentType as content, userType } from '../../constants/constants';
import timezoneData from '../../constants/timezone.json';
import CreateNewLay from '../../layout/CreateNew/CreateNewLay';
import { useCreateContentMutation, useUpdateContentMutation } from '../../rtk/features/api/content.api';
import { cleanEmptyObjValue } from '../../utils/utils.fn';
import { SLIDE_TYPES, data as contentItems } from './data';
import Toggle from '../../components/Toggle/Toggle';
import RadioToggle from '../../components/RadioToggle/RadioToggle';
import DocsUploader from '../../components/DocsUploader/DocsUploader';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import ImageUploaderMultiple from '../../components/ImageUploader/ImageUploaderMultiple';
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker';
import Loading from '../../components/Loading';

const { SLIDE, KHUTBAH } = content;

function CreateContent() {
  const [isUrl, setIsUrl]= useState(false);
  const [isImage, setIsImage]= useState(true);
  const { handleSubmit, register, setValue, setError, clearErrors, formState: { errors } } = useForm();
  const [timezone, setTimezone] = useState('');
  const [contentTypeDisplay, setContentTypeDisplay] = useState('');
  const [slideTypeDisplay, setSlideTypeDisplay] = useState('Regular Slide');
  const [contentType, setContentType] = useState('');
  const [slideType, setSlideType] = useState('');
  const [waqto, setWaqto] = useState('');
  const [file, setFile] = useState('');
  const [videoFile, setVideoFile] = useState('');
  const [audio, setAudio] = useState('');
  const [createContent, { isLoading }] = useCreateContentMutation();
  const [updateContent, { isLoading: updating }] = useUpdateContentMutation();
  const { orgs } = useSelector((state) => state.org);
  const { userType: user } = useSelector((state) => state.user);
  const [days, setDays]=useState([]);
  // const audioRef = useRef();
  let typingTimer;
  const [orgList, setOrgList]= useState([]);
  const [active, setActive]=useState(false);
  const [searchVal, setSearchVal]=useState('');
  const isOrgMember = user === userType.admin || user === userType.masjidOwner;
  const [photos, setPhotos] = useState({});
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'webm'];
  const [video, setVideo]=useState([]);
  const [image, setImage]= useState([]);
  const nameRef=useRef();
  const contentTypeRef=useRef();
  const waqtoRef=useRef();
  const endTimeRef=useRef();
  const endDateTimeRef=useRef();
  const mediaRef= useRef();

  const { state } = useLocation();
  document.title=`${import.meta.env.VITE_APP_TITLE} | ${state? 'UPDATE CONTENT': 'CREATE CONTENT'}`;
  const isUpdate = !!state;
  useEffect(() => {
    if (isOrgMember && !isUpdate) setValue('id', orgs[0]?.id);
    if (isUpdate) {
      setValue('noFile', false);
      if (state?.src) {
        const fileExtension = state.src.split('.').pop().toLowerCase();
        if (videoExtensions.includes(fileExtension)) {
          setIsImage(false);
          setVideo([{ src: state?.src, name: state.fileName }]);
        } else {
          setImage([state.src]);
        }
      }
      setValue('eventName', state?.eventName);
      setWaqto(state?.waqto);
      setValue('id', state?.id);
      setContentTypeDisplay(state?.type?.replace(/([A-Z])/g, ' $1').trim().toUpperCase());
      setContentType(state?.type);
      setSlideType(state?.slideType);
      setSlideTypeDisplay(state?.slideType===''? 'REGULAR SLIDE' : state?.slideType?.replace(/([A-Z])/g, ' $1').trim().toUpperCase());
      setValue('time', state?.time);
      setTimezone(state?.zone);
      if (state?.fileName===undefined && state?.src!=='') {
        setValue('url', state?.src);
        if ((state.type==='slide'&& state?.slideType!=='eventCountdown') || state?.type==='khutbah' || state?.type==='azan') setIsUrl(true);
        setImage([]);
        setVideo([]);
      }
    }
  }, [state]);

  const onSubmit = (data) => {
    if (data?.id===null || data?.id===undefined) {
      setError('masjidName', { message: 'Select masjid name' });
      nameRef.current.focus();
      return;
    }
    if (contentType==='') {
      setError('contentType', { message: 'Select content type' });
      contentTypeRef.current.focus();
      return;
    }
    if (contentType==='prayerTime' &&timezone==='') {
      setError('timeZone', { message: 'Select time zone' });
      return;
    }
    if (contentType && contentType!=='prayerTime'&& contentType!=='slide' && waqto==='') {
      setError('waqto', { message: 'Please select waktu' });
      waqtoRef.current.focus();
      return;
    }
    if (contentType==='azan' && data?.startTime>= data.endTime) {
      setError('endTime', { message: 'End time must be grater than duration' });
      endTimeRef.current.focus();
      return;
    }
    if (contentType==='slide') {
      if (data.startDateTime==='') return setError('startTimeDate', { message: 'Start Date Time is mandetory' });
      if (data.endDateTime==='') return setError('endDateTime', { message: 'End Date Time is mandetory' });
      if (new Date(data.startDateTime) >= new Date(data.endDateTime)) {
        setError('endDateTime', { message: 'End Date Time must be greater than Start Date Time' });
        endDateTimeRef.current.focus();
        return;
      }
      data.dateRange=[data?.startDateTime, data?.endDateTime];
    }
    if (contentType===SLIDE && slideType==='eventCounddown' && (data?.dateRange[0]===''|| data?.dateRange[1]==='')) return setError('dateRange', { message: 'This field is required' });
    const fromData = new FormData();
    const slidePhotos=[];
    if (contentType==='salatSlide') {
      Object.keys(photos).map((key) => {
        if (typeof photos[key]==='string')slidePhotos.push(photos[key]);
        else fromData.append('image', photos[key]);
      });
    }
    if (((contentType==='slide' && slideType!=='eventCountdown')|| contentType==='azan' || contentType==='khutbah')) {
      if ((isUrl===true && data?.url==='')|| (isUrl===false && isImage===true && file==='') || (isUrl===false && isImage===false && videoFile==='')) {
        setError('media', { message: 'Choose any image or video or video url' });
        mediaRef.current.focus();
        return;
      }
    }
    const imagesData = contentType==='salatSlide'? { slidePhotos }: {};
    if (!isUpdate) {
      if (isUrl===false) {
        if (isImage===true && typeof file==='object') fromData.append('image', file);
        else if (isImage===false && typeof videoFile==='object') fromData.append('image', videoFile);
      }
      if (audio) fromData.append('audio', audio);
      const objData = cleanEmptyObjValue({ org: data?.id, type: contentType, zone: timezone?.split(':')[0], waqto, startTime: data?.startTime, src: data?.url, layout: data?.layout, days, dateRange: data?.dateRange, endTime: data?.endTime, ...imagesData, slideType, eventName: data?.eventName });
      if (objData) fromData.append('data', JSON.stringify(objData));
      createContent(fromData);
    }
    // for updating
    if (isUpdate) {
      if (isUrl===false) {
        if (isImage===true && typeof file==='object') fromData.append('image', file);
        else if (isImage===false && typeof videoFile==='object') fromData.append('image', videoFile);
      }
      if (audio) fromData.append('audio', audio);
      const updateData = cleanEmptyObjValue({ type: contentType, zone: timezone?.split(':')[0], waqto, startTime: data?.startTime, orgId: state.orgId, layout: data?.layout, dateRange: data?.dateRange, days, src: data?.url, endTime: data?.endTime, ...imagesData, slideType, eventName: data?.eventName, noFile: (isImage===true && file==='') || (isImage===false && videoFile===''), noAudio: data?.noAudio });
      if (updateData) fromData.append('data', JSON.stringify(updateData));
      updateContent({ body: fromData, id: data?.id });
    }
  };

  const handleSearch = (value) => {
    setSearchVal(value);
    setValue('id', null);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      fetch(`${baseUrl}organization?search=${value}&limit=30`, {
        credentials: 'include',
      }).then((res) => res.json()).then((data) => {
        setOrgList(data.docs);
      });
    }, 500);
  };
  const handleAudioChange = (e) => {
    if (Object.keys(e).length>0) {
      setValue('noAudio', false);
      if (typeof e[Object.keys(e)[0]].src !== 'string') {
        setAudio(e[Object.keys(e)[0]].src);
      }
    } else {
      setAudio('');
      setValue('noAudio', true);
    }
  };
  const handleVideoChange = (e) => {
    if (Object.keys(e).length>0) {
      setVideoFile(e[Object.keys(e)[0]].src);
    } else {
      setVideoFile('');
    }
  };

  return (
    <CreateNewLay
      headerHide
      onSubmit={handleSubmit(onSubmit)}
      className='space-y-2'
      btnText={isUpdate ? 'Update' : 'Save'}
      title=' content'
      isLoading={isUpdate ? updating : isLoading}
      clearErrors={clearErrors}
      isCreate={!state}
    >

      <div className='h-5'>
        {
          (isLoading || updating)?<Loading />:''
        }
      </div>
      <div ref={nameRef} tabIndex={-1}>
        {
          user==='supper-admin' && !isUpdate? <TextInput value={searchVal} disabled={isUpdate} placeholder='Type masjid name here' label='Masjid Name' onChange={(e) => handleSearch(e.target.value)} onFocus={() => setActive(true)} EndIcon={Search} EndIconStyle='w-[20px] h-[20px] mt-0.5' />:''
        }
      </div>
      <div className={`relative ${active===true? 'block': 'hidden'}`}>
        <ul className='absolute top-0 left-0 right-0 bg-white rounded divide-y ' style={{ boxShadow: 'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px' }}>
          {
            orgList.map((l, index) => (
              <li className='cursor-pointer hover:bg-tints-100 p-2 rounded' onClick={() => { setActive(false); setSearchVal(l.name); setValue('id', l._id); }} key={index}>
                {l.name}
              </li>))
          }

        </ul>
      </div>
      {
        errors?.masjidName? <p className='text-error'>{errors?.masjidName?.message}</p>:''
      }
      {/* Content Type */}
      <div ref={contentTypeRef} tabIndex={-2}>
        <DropDown
          items={contentItems}
          label='Content Type'
          onSelect={(e) => setContentTypeDisplay(e)}
          value={contentTypeDisplay}
          onKayData={(e) => {
            setIsImage(true);
            setIsUrl(false);
            if (e=== KHUTBAH) {
              setContentType(e); setWaqto('ZOHOR');
            } else {
              setContentType(e);
              if (e==='syurukCountDown' || e==='syurukMain' || e==='syurukEnd') {
                setWaqto('SYURUK');
              } else setWaqto('');
            }
          }}
          isSplit
          disable={isUpdate}
        />
      </div>
      {
        errors?.contentType? <p className='text-error'>{errors?.contentType?.message}</p>:''
      }
      {/* Slide Type */}
      {
        contentType==='slide'?(
          <DropDown
            label='Slide Type'
            items={SLIDE_TYPES}
            isSplit
            onSelect={(e) => setSlideTypeDisplay(e)}
            value={slideTypeDisplay}
            onKayData={(e) => setSlideType(e)}
            disable={isUpdate}

          />
        )
          :''
      }
      {/* Waqtu */}
      <div ref={waqtoRef} tabIndex={-3} className={`${(!contentType || (contentType==='prayerTime' || contentType==='slide'))? 'hidden': 'block'}`}>
        <DropDown
          items={(contentType==='syurukCountDown' || contentType==='syurukMain' || contentType==='syurukEnd')? ['SYURUK'] : ['SUBUH', 'ZOHOR', 'ASAR', 'MAGHRIB', 'ISYAK']}
          label='Waktu'
          onSelect={(e) => setWaqto(e)}
          value={waqto}
          error={errors?.waqto?.message}
          disable={isUpdate || contentType==='syurukCountDown' || contentType==='syurukMain' || contentType==='syurukEnd' || contentType===KHUTBAH}
        />
      </div>
      {
        (contentType==='slide') ?(
          <div className='text-zinc-800 ' ref={endDateTimeRef} tabIndex={-5}>
            <DateTimePicker errors={errors?.startDateTime?.message} label='Start Date' defaultValue={state? new Date(state?.dateRange[0]) : new Date()} onChange={(e) => setValue('startDateTime', e)} />
            <DateTimePicker errors={errors?.endDateTime?.message} label='End Date' defaultValue={state? new Date(state?.dateRange[1]) : new Date()} onChange={(e) => setValue('endDateTime', e)} />
            <DayPicker onChange={setDays} value={state?.days} />
          </div>
        )
          :''
      }
      {/* Date and day picker */}
      {/* {
        (contentType===SLIDE && slideType!=='eventCountdown')
          ?(
            <div>
              <DateRangePicker label='Select Date Range' name='dateRange' setValue={setValue} value={state?.dateRange} onChange={(e) => { setDateRange(e); }} errors={errors.dateRange} />
              <DayPicker onChange={setDays} value={state?.days} />
            </div>
          ):''
      } */}
      {/* Praying Time */}
      {contentType === 'prayerTime' && (
        <DropDown
          items={timezoneData.timezone}
          label='Time zone'
          onSelect={(e) => setTimezone(e)}
          value={timezone}
        />
      ) }
      {
        errors?.timeZone? <p className='text-error'>{errors?.timeZone.message}</p>:''
      }
      {/* Duration */}
      {
        (!contentType || contentType==='prayerTime')? '' : (
          <Duration
            label='Duration'
            onChange={(e) => setValue('startTime', e)}
            defaultValue={state?.time || (contentType==='syurukMain'? 1680000 : 60000)}
          />
        )
      }
      {/* Eqomah Count Down Start Time */}
      <div ref={endTimeRef} tabIndex={-4}>
        {contentType!=='azan'? '' : (
          <Duration
            label='Eqama countdown start time (Azan duration+ delay)'
            onChange={(e) => setValue('endTime', e)}
            defaultValue={state?.endTime}
          />
        ) }
      </div>
      {
        errors?.endTime? <p className='text-error'>{errors?.endTime.message}</p>:''
      }
      {/* Event Name Text */}
      {
        contentType==='slide' && slideType==='eventCountdown' ?(
          <TextInput
            label='Event Name'
            register={register('eventName', { required: 'Event name is required' })}
            placeholder='Text to display'
            error={errors?.eventName?.message}
          />
        )
          :''
      }

      {/* Media Upoloads */}
      {
        (contentType && (contentType==='azan' || contentType==='khutbah' || contentType==='salat' || contentType==='salatSlide' || contentType==='syurukMain' || contentType==='slide'))? (
          <div>
            <h1>Media Uploads</h1>
            <div className='w-fit pt-2'>
              <Toggle label1='FILE' label2='URL' defaultValue={isUrl} callBack={(t, val) => setIsUrl(val)} hide={(contentType==='azan' || contentType==='khutbah' || (contentType==='slide' && slideType!=='eventCountdown'))? false: true} />
            </div>
            {
              isUrl!==true? (
                <div className='flex gap-10 flex-col sm:flex-row'>
                  <div>
                    <div className='w-fit pt-2'>
                      <RadioToggle label1='Image' label2='Video' width='w-[100px]' defaultValue={isImage} callBack={(t, e) => setIsImage(e)} hideSecond={(contentType==='azan' || contentType==='khutbah' || (contentType==='slide' && slideType!=='eventCountdown'))? false : true} />
                    </div>
                    {
                      isImage===true? (
                        <div>
                          {
                            contentType==='salatSlide'? (
                              <ImageUploader
                                limit={5}
                                thumbnails={state?.slidePhotos || []}
                                callBack={(e) => setPhotos(e)}
                              />
                            )
                              :(
                                <ImageUploaderMultiple
                                  limit={1}
                                  thumbnails={image}
                                  callBack={(e) => {
                                    if (Object.keys(e).length>0) {
                                      setFile(e[Object.keys(e)[0]]);
                                    } else setFile('');
                                  }}
                                />
                              )
                          }
                        </div>

                      )
                        :(
                          <DocsUploader
                            type='video'
                            thumbnails={video}
                            callBack={(e) => handleVideoChange(e)}
                          />
                        )
                    }
                  </div>
                  { (contentType && contentType!=='prayerTime' && contentType!=='salatSlide')
                    ?(
                      <div className='pt-3'>
                        <label htmlFor='file' className=''>Audio </label>
                        <div className='pt-1'>
                          <DocsUploader
                            type='audio'
                            thumbnails={state?.audioSrc? [{ src: state?.audioSrc, name: state?.audioFileName }]:[]}
                            callBack={(e) => handleAudioChange(e)}
                          />
                        </div>
                      </div>)
                    :''}
                </div>
              )
                : (
                  <div className='pt-5'>
                    <TextInput
                      error={errors?.url?.message}
                      register={register('url', {
                        pattern: {
                          value: /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|vimeo\.com\/|dai\.ly\/|dailymotion\.com\/video\/|facebook\.com\/.*\/videos\/)|.*\.(mp4|mkv)$/i,
                          message: 'Invalid video URL or unsupported video file extension',
                        } })}
                      placeholder='Url'
                    />
                  </div>
                )
            }

          </div>
        ):''
      }
      <div ref={mediaRef} tabIndex={-6}>
        {
          errors?.media? <p className='text-error'>{errors?.media?.message}</p> :''
        }
      </div>

      { (contentType && contentType!=='prayerTime' && (contentType==='salatSlide' || isUrl===true || contentType==='azanCountdown' || contentType==='iqomahCountdown' || contentType==='syurukCountDown' || contentType==='syurukMain' || contentType==='syurukEnd'))
        ?(
          <div className='pt-5'>
            <label htmlFor='file' className=''>Audio </label>
            <div className='pt-5'>
              <DocsUploader
                type='audio'
                thumbnails={state?.audioSrc? [{ src: state?.audioSrc, name: state?.audioFileName }]:[]}
                callBack={(e) => handleAudioChange(e)}
              />
            </div>
          </div>)
        :''}

      {/* Choose Layout */}
      {contentType === 'slide'? (
        <div className='mt-4'>
          <p>Choose Layout</p>
          <div className='flex justify-center  gap-5 flex-wrap my-3 border-2 pt-3 pb-6 rounded-lg items- px-6'>
            <div className='relative h-32 mex-w-[10rem] flex justify-center cursor-pointer'>
              <input defaultChecked={isUpdate? (state?.layout==='one'? true: false): true} {...register('layout', { required: true })} value='one' type='radio' className='absolute left-5 top-2' id='one' />
              <label className='w-full h-full' htmlFor='one'><Layout01 className='cursor-pointer w-full h-full' /></label>
            </div>
            <div className='relative h-32 mex-w-[10rem] flex justify-center cursor-pointer'>
              <input defaultChecked={isUpdate? (state?.layout==='two'? true: false): false} {...register('layout', { required: true })} value='two' type='radio' name='layout' className='absolute left-5 top-2 cursor-pointer' id='two' />
              <label className='w-full h-full ' htmlFor='two'><Layout02 className='cursor-pointer w-full h-full' /></label>
            </div>
            <div className='relative h-32 mex-w-[10rem] flex justify-center cursor-pointer'>
              <input defaultChecked={isUpdate? (state?.layout==='three'? true: false): false} {...register('layout', { required: true })} value='three' type='radio' name='layout' className='absolute left-5 top-2 cursor-pointer' id='three' />
              <label className='w-full h-full ' htmlFor='three'><Layout03 className='cursor-pointer w-full h-full' /></label>
            </div>
          </div>
        </div>
      ) : null}

    </CreateNewLay>
  );
}

export default CreateContent;
