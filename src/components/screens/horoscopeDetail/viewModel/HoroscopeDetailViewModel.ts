import { useCallback, useEffect, useState } from 'react'
import { HoroscopeResponseModel } from '@/api/features/horoscope/models/HoroscopeModel'
import { ResultObject } from '@/api/baseApiResponseModel/baseApiResponseModel';
import { useAuth } from '@/context/auth/useAuth';
import { defaultHoroscopeRepo } from '@/api/features/horoscope/HoroscopeRepo';

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
        content: error?.error?.message || error?.message || localStrings.GLobals.ErrorMessage
      })
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getHoroscopeDetail();
  }, [date, language]);

  return {
    resultObject,
    horoscope,
    loading
  }
}

export default HoroscopeDetailViewModel