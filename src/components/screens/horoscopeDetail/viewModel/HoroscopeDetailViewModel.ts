import { useCallback, useState } from 'react'
import { HoroscopeResponseModel } from '@/src/api/features/horoscope/models/HoroscopeModel'
import { ResultObject } from '@/src/api/baseApiResponseModel/baseApiResponseModel';
import { useAuth } from '@/src/context/auth/useAuth';
import { defaultHoroscopeRepo } from '@/src/api/features/horoscope/HoroscopeRepo';
import { useFocusEffect } from 'expo-router';

const HoroscopeDetailViewModel = (date: string) => {
  const { localStrings, language } = useAuth();
  const [resultObject, setResultObject] = useState<ResultObject | null>(null);
  const [horoscope, setHoroscope] = useState<HoroscopeResponseModel | null>(null);
  const [loading, setLoading] = useState(false);

  const getHoroscopeDetail = async () => {
    try {
      setLoading(true);
      const res = await defaultHoroscopeRepo.getHoroscopeDetail({ language: language, date });
      if (res?.code === 200 && res?.data) {
        setHoroscope(res?.data);
      } else {
        setHoroscope(null);
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        title: localStrings.GLobals.ErrorMessage,
        content: error?.error?.message || error?.message
      })
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getHoroscopeDetail();
    }, [date, language])
  );

  return {
    resultObject,
    horoscope,
    loading
  }
}

export default HoroscopeDetailViewModel