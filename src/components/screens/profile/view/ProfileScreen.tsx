"use client";
import React from 'react'
import ProfileViewModel from '../viewModel/ProfileViewModel'
import { useAuth } from '@/context/auth/useAuth';
import useColor from '@/hooks/useColor';
import dayjs from 'dayjs';
import { Avatar, Divider, Image } from 'antd';
import { AVARTAR_IMAGE } from '@/consts/ImgPath';
import { IoMdFemale, IoMdMale, IoMdSettings } from 'react-icons/io';
import { FaFacebookF } from 'react-icons/fa6';
import { IoPhonePortrait } from 'react-icons/io5';
import UpdateProfileView from './updateProfile/UpdateProfileView';

const ProfileScreen = () => {
  const { user } = useAuth();
  const { brandPrimaryDark, brandPrimary } = useColor();
  const [open, setOpen] = React.useState(false);

  return (
    <div style={{ backgroundColor: brandPrimaryDark }} className='p-3 m-1 rounded-md'>
      <div className='flex flex-row justify-between'>
        <Avatar
          src={user?.avatar || AVARTAR_IMAGE}
          alt='avatar'
          shape='circle'
          size={60}
          className='mr-2 w-[20%]'
        />
        <div className='flex flex-col justify-center w-[74%]'>
          <div className='font-bold text-xl truncate'>{user?.name}</div>
          <div className='flex flex-row justify-between'>
            <div className='text-gray-400 '>{dayjs(user?.birthDate).format('DD/MM/YYYY')}</div>
            <IoMdSettings size={20} className='cursor-pointer'  onClick={() => setOpen(true)}/>
          </div>
        </div>
      </div>
      <Divider dashed style={{ borderColor: brandPrimary, borderWidth: 1, margin: '16px 0px' }} />
      <div className='flex flex-row justify-between'>
        <div style={{ backgroundColor: brandPrimary }} className='rounded-md h-[50px] w-[70px] flex justify-center items-center'>
          {user?.gender === "male" ? <IoMdMale size={32} /> : <IoMdFemale size={32} />}
        </div>
        <div style={{ backgroundColor: brandPrimary }} className='rounded-md h-[50px] w-[70px] p-2 flex justify-center items-center'>
          <Image
            src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT!}/card/zodiac/zodiac-${user?.zodiac}.png` || AVARTAR_IMAGE}
            alt='zodiac'
            preview={false}
          />
        </div>
        <div style={{ backgroundColor: brandPrimary }} className='rounded-md h-[50px] w-[70px] flex justify-center items-center'>
          {user?.type === "facebook" ? <FaFacebookF size={32} /> : <IoPhonePortrait size={32} />}
        </div>
      </div>
      <UpdateProfileView
        open={open}
        onCancel={() => setOpen(false)}
      />
    </div>
  )
}

export default ProfileScreen