import { ResultObject } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { PackageResponseModel } from "@/api/features/topUp/models/PackageModel";
import { defaultTopUpRepo } from "@/api/features/topUp/TopUpRepo"
import { useAuth } from "@/context/auth/useAuth";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const TopUpViewModel = () => {
  const [resultObject, setResultObject] = useState<ResultObject | null>(null);
  const { localStrings, getUser } = useAuth();
  const [packageLoading, setPackageLoading] = useState(false);
  const [packages, setPackages] = useState<PackageResponseModel[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PackageResponseModel | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const search = useSearchParams();
  const orderId = search.get('orderId');
  const resultCode = search.get('resultCode');

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
          content: localStrings.Topup.GetListPackageFailed + ': ' + res?.message,
        })
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        content: error?.error?.message || error?.message || localStrings.GLobals.ErrorMessage
      })
    } finally {
      setPackageLoading(false);
    }
  }

  const createBill = async (packageId: string) => {
    try {
      setPaymentLoading(true);
      const returnUrl = window.location.origin + '/package';
      const res = await defaultTopUpRepo.createBill({
        packageId: packageId,
        returnUrl,
      });
      if (res?.code === 200 && res?.data) {
        window.location.href = res?.data;
      } else {
        setResultObject({
          type: 'error',
          content: localStrings.Topup.CreateBillFailed,
        })
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        content: error?.error?.message || error?.message || localStrings.GLobals.ErrorMessage
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
          content: res?.message
        })
      } else {
        setResultObject({
          type: 'error',
          content: res?.message
        })
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        content: error?.error?.message || error?.message || localStrings.GLobals.ErrorMessage
      })
    } finally {
      setPaymentLoading(false);
    }
  }

  useEffect(() => {
    getPackageList();
  }, [])

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