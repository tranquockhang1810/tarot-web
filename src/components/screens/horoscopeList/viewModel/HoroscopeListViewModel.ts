import { ResultObject } from '@/src/api/baseApiResponseModel/baseApiResponseModel';
import { defaultHoroscopeRepo } from '@/src/api/features/horoscope/HoroscopeRepo';
import { HoroscopeResponseModel } from '@/src/api/features/horoscope/models/HoroscopeModel'
import { useAuth } from '@/src/context/auth/useAuth';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react'

const HoroscopeListViewModel = () => {
  const [resultObject, setResultObject] = useState<ResultObject | null>(null);
  const { localStrings, language, user } = useAuth();
  const [list, setList] = useState<HoroscopeResponseModel[] | null>([]);
  const [loading, setLoading] = useState(false);

  const getHoroscopeList = async () => {
    try {
      setLoading(true);
      const res = await defaultHoroscopeRepo.getHoroscopeList({ language: language });
      if (res?.code === 200 && res?.data) {
        setList(res?.data);
      } else {
        setList([]);
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
      getHoroscopeList();
    }, [language, user])
  );

  return {
    resultObject,
    list,
    loading
  }
}

export default HoroscopeListViewModel