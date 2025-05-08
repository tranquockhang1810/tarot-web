"use client";
import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import { CurrencyFormat } from "@/utils/helper/CurrencyFormat";
import { showToast } from "@/utils/helper/SendMessage";
import dayjs from "dayjs";
import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import TransactionHistoryViewModel from "../viewModel/TransactionHistoryViewModel";
import { useRouter } from "next/navigation";
import { FaCheck, FaCoins } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";
import { Button, Spin } from "antd";

const TransactionHistoryView = () => {
  const { localStrings, language } = useAuth();
  const router = useRouter();
  const { brandPrimaryDark, brandPrimaryTap, redError, brandPrimary } = useColor();

  const {
    billList,
    getMoreChats,
    loading,
    resultObject,
    query, setQuery
  } = TransactionHistoryViewModel();

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        content: resultObject?.content
      });
    }
  }, [resultObject]);

  const filter = [
    { label: localStrings.GLobals.All, value: undefined },
    { label: localStrings.Transaction.Package, value: "package" },
    { label: localStrings.Transaction.Point, value: "point" },
  ];

  const PackageBill = ({ item }: { item: any }) => (
    <div className="w-full my-4 rounded-xl p-4 flex items-center" style={{ backgroundColor: brandPrimary }}>
      <div className="mr-4 flex items-center justify-center bg-yellow-400 w-[70px] h-[70px] rounded-full">
        {/* Icon coin */}
        <FaCoins size={40} color="white" />
      </div>
      <div className="flex-1 flex flex-col">
        <p className="text-white text-sm font-bold">{language === "en" ? `Package ${item?.package?.point} points` : item?.package?.description}</p>
        <p className="text-white text-lg font-bold">{CurrencyFormat(item?.totalPrice)}</p>
        <div className="flex justify-between items-center w-full">
          <span className={`text-sm font-bold ${item?.status ? "text-green-400" : "text-red-500"}`}>
            {item?.status ? localStrings.GLobals.Success : localStrings.GLobals.Failed}
          </span>
          <span className="text-white text-xs opacity-60">{dayjs(item?.createdAt).format("DD/MM/YYYY HH:mm")}</span>
        </div>
      </div>
    </div>
  );

  const PointBill = ({ item }: { item: any }) => (
    <div className="w-full my-4 rounded-xl p-4 flex items-center" style={{ backgroundColor: brandPrimary }}>
      <div className="mr-4 flex items-center justify-center bg-yellow-400 w-[70px] h-[70px] rounded-full overflow-hidden">
        {item?.topic?.image ? (
          <img
            src={`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}${item?.topic?.image}`}
            alt="topic"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <MdPayments size={45} color="white" />
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <p className="text-white text-lg font-bold">{localStrings?.Topics?.[item?.topic?.code as keyof typeof localStrings.Topics] || localStrings.Transaction.TopupPoint}</p>
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <span className={`text-lg font-bold ${item?.action ? "text-green-400" : "text-red-500"}`}>
              {(item?.action ? "+" : "-") + item?.point}
            </span>
            <FaCoins size={20} color="yellow" className="ml-2" />
          </div>
          <span className="text-white text-xs opacity-60">{dayjs(item?.createdAt).format("DD/MM/YYYY HH:mm")}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4">
        <h1 className="text-white text-xl font-bold">{localStrings.Profile.TransHistory}</h1>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap justify-between px-5">
        {filter.map((item, index) => (
          <Button
            type="primary"
            ghost={query?.type === item.value ? false : true}
            key={index}
            onClick={() => setQuery((prev) => ({ ...prev, type: item.value }))}
            className={`px-6 py-2 my-2 rounded-lg font-bold flex items-center justify-center w-[30%]`}
            icon={query?.type === item.value && <FaCheck color="white" />}
          >
            <span className="text-white">{item.label}</span>
          </Button>
        ))}
      </div>

      {/* Bill List */}
      <div id="scrollableDiv" className="flex-1 overflow-auto"
        style={{
          scrollbarWidth: "none"
        }}
      >
        <InfiniteScroll
          dataLength={billList.length}
          next={getMoreChats}
          hasMore={true}
          loader={loading && billList.length > 10 && (
            <div className="flex justify-center my-4">
              <Spin />
            </div>
          )}
          scrollThreshold={0.8}
          className="px-5"
          scrollableTarget="scrollableDiv"
        >
          {billList.map((item) => (
            item.type === "package"
              ? <PackageBill key={item._id} item={item} />
              : <PointBill key={item._id} item={item} />
          ))}
        </InfiniteScroll>
      </div>

    </div>
  );
}

export default TransactionHistoryView