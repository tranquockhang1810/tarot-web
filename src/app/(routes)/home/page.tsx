"use client";
import { useAuth } from '@/context/auth/useAuth';
import { Button } from 'antd';
import React from 'react'

function home() {
  const { user, onLogout } = useAuth();
  return (
    <>
      <div>Xin chào {user?.name}</div>
      <Button onClick={onLogout}>Đăng xuất</Button>
    </>
  )
}

export default home