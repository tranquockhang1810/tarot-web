import { ResultObject } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { BillModel } from "@/api/features/topUp/models/BillModel";
import { TransactionListRequestModel } from "@/api/features/transactionHistory/models/TransactionListModel";
import { defaultTransactionHistoryRepo } from "@/api/features/transactionHistory/TransactionHistoryRepo";
import { useAuth } from "@/context/auth/useAuth";
import { useCallback, useEffect, useState } from "react"

const TransactionHistoryViewModel = () => {
  const [resultObject, setResultObject] = useState<ResultObject | null>(null);
  const { localStrings } = useAuth();
  const [loading, setLoading] = useState(false);
  const [billList, setBillList] = useState<BillModel[]>([]);
  const [query, setQuery] = useState<TransactionListRequestModel>({ page: 1, limit: 10 });
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const getBillList = async (query: TransactionListRequestModel) => {
    try {
      setLoading(true);
      const res = await defaultTransactionHistoryRepo.getTransactionHistory(query);
      if (res?.code === 200 && res?.data) {
        setBillList((prev) => {
          if (query?.page === 1) return res.data;
          const newBills = res.data.filter(
            (bill) => !prev?.some((existingBill) => existingBill._id === bill._id)
          );
          return prev ? [...prev, ...newBills] : res.data;
        });
        setPage(res?.paging?.page);
        setHasMore(res?.paging?.page < res?.paging?.totalPages);
      } else {
        setBillList([]);
        setPage(0);
        setHasMore(false);
        setResultObject({
          type: 'error',
          content: localStrings.Transaction.GetListBillFailed + " " + res?.message,
        })
      }
    } catch (error: any) {
      console.error(error);
      setResultObject({
        type: 'error',
        content: error?.error?.message || error?.message || localStrings.GLobals.ErrorMessage,
      })
    } finally {
      setLoading(false);
    }
  }

  const getMoreChats = () => {
    if (hasMore && !loading && page > 0) {
      getBillList({ ...query, page: page + 1 });
    }
    else return;
  }

  useEffect(() => {
    setBillList([]);
    setPage(0);
    getBillList(query);
  }, [query])

  return {
    resultObject,
    loading, billList,
    query, setQuery,
    getMoreChats, hasMore
  }
}

export default TransactionHistoryViewModel