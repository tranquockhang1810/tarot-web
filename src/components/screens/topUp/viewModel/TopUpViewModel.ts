import { ResultObject } from "@/src/api/baseApiResponseModel/baseApiResponseModel";
import { PackageResponseModel } from "@/src/api/features/topUp/models/PackageModel";
import { defaultTopUpRepo } from "@/src/api/features/topUp/TopUpRepo"
import { useAuth } from "@/src/context/auth/useAuth";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from 'expo-web-browser';

const TopUpViewModel = () => {
  const [resultObject, setResultObject] = useState<ResultObject | null>(null);
  const { localStrings, getUser } = useAuth();
  const [packageLoading, setPackageLoading] = useState(false);
  const [packages, setPackages] = useState<PackageResponseModel[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageResponseModel | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const { orderId, resultCode } = useLocalSearchParams();

  const getPackageList = async () => {
    try {
      setPackageLoading(true);
      const res = await defaultTopUpRepo.getPackageList({ page: 1, limit: 100 });
      if (res?.code === 200 && res?.data) {
        setPackages(res?.data);
      } else {
        setPackages([]);
        setResultObject({
          type: 'error',
          title: localStrings.Topup.GetListPackageFailed,
          content: res?.message
        })
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        title: localStrings.GLobals.ErrorMessage,
        content: error?.error?.message || error?.message
      })
    } finally {
      setPackageLoading(false);
    }
  }

  const createBill = async (packageId: string) => {
    try {
      setPaymentLoading(true);
      const returnUrl = Linking.createURL(`/(routes)/top-up`);
      const res = await defaultTopUpRepo.createBill({
        packageId: packageId,
        returnUrl,
      });
      if (res?.code === 200 && res?.data) {
        await WebBrowser.openAuthSessionAsync(res.data, returnUrl);
      } else {
        setResultObject({
          type: 'error',
          title: localStrings.Topup.CreateBillFailed,
          content: res?.message
        })
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        title: localStrings.GLobals.ErrorMessage,
        content: error?.error?.message || error?.message
      })
    } finally {
      setPaymentLoading(false);
    }
  }

  const paidConfirm = async (orderId: string, resultCode: number) => {
    try {
      setPaymentLoading(true);
      const res = await defaultTopUpRepo.payedResult({
        orderId: orderId,
        resultCode: resultCode,
      });
      if (res?.code === 200 && res?.data) {
        await getUser();
        setResultObject({
          type: 'success',
          title: localStrings.Topup.CreateBillSuccess,
          content: res?.message
        })
      } else {
        setResultObject({
          type: 'error',
          title: localStrings.Topup.CreateBillFailed,
          content: res?.message
        })
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        title: localStrings.GLobals.ErrorMessage,
        content: error?.error?.message || error?.message
      })
    } finally {
      setPaymentLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getPackageList();
    }, [])
  )

  useEffect(() => {
    if (resultCode && orderId) {
      paidConfirm(Array.isArray(orderId) ? orderId[0] : orderId, Number(resultCode));
    }
  }, [resultCode, orderId])

  return {
    resultObject,
    packageLoading,
    packages,
    selectedPackage, setSelectedPackage,
    paymentLoading, createBill
  }
}

export default TopUpViewModel