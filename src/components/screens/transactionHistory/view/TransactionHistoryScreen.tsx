import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import Screen from '@/src/components/layout/Screen'
import { useAuth } from '@/src/context/auth/useAuth'
import { Entypo, FontAwesome6, MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import useColor from '@/src/hooks/useColor'
import TransactionHistoryViewModel from '../viewModel/TransactionHistoryViewModel'
import { Image } from 'expo-image'
import { BillModel } from '@/src/api/features/topUp/models/BillModel'
import dayjs from 'dayjs'
import { CurrencyFormat } from '@/src/utils/helper/CurrencyFormat'
import { showToast } from '@/src/utils/helper/SendMessage'

const TransactionHistoryScreen = () => {
  const { localStrings } = useAuth();
  const { brandPrimaryDark, brandPrimaryTap, redError } = useColor();
  const {
    billList,
    getMoreChats,
    loading,
    resultObject,
    query, setQuery
  } = TransactionHistoryViewModel();

  const filter = [
    { label: localStrings.GLobals.All, value: undefined },
    { label: localStrings.Transaction.Package, value: "package" },
    { label: localStrings.Transaction.Point, value: "point" },
  ]

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        title: resultObject?.title,
        content: resultObject?.content
      });
    }
  }, [resultObject]);

  const PackageBill = ({ item, key }: { item: BillModel, key?: string }) => {
    return (
      <View key={key}
        style={{
          width: "100%",
          marginVertical: 10,
          backgroundColor: brandPrimaryTap,
          borderRadius: 10,
          padding: 10,
          justifyContent: "flex-start",
          alignItems: "center",
          flexWrap: "wrap",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            marginRight: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#EAB950",
            width: 70, height: 70,
            borderRadius: 90
          }}
        >
          <FontAwesome6 name="coins" size={40} color={"white"} />
        </View>
        <View style={{
          flex: 1,
          flexWrap: "wrap",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start"
        }}>
          <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>{`Package ${item?.package?.point} points`}</Text>
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>{CurrencyFormat(item?.totalPrice as number)}</Text>
          <View style={{ flex: 1, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={{ color: item?.status ? "palegreen" : redError, fontSize: 14, fontWeight: "bold" }}>{item?.status ? localStrings.GLobals.Success : localStrings.GLobals.Failed}</Text>
            <Text style={{ color: "white", fontSize: 12, opacity: 0.6, fontWeight: "semibold" }}>{dayjs(item?.createdAt).format("DD/MM/YYYY HH:mm")}</Text>
          </View>
        </View>
      </View>
    )
  }

  const PointBill = ({ item, key }: { item: BillModel, key?: string }) => {
    return (
      <View key={key}
        style={{
          width: "100%",
          marginVertical: 10,
          backgroundColor: brandPrimaryTap,
          borderRadius: 10,
          padding: 10,
          justifyContent: "flex-start",
          alignItems: "center",
          flexWrap: "wrap",
          flexDirection: "row",
        }}
      >
        <View
          style={{
            marginRight: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: item?.topic ? brandPrimaryDark : "#EAB950",
            width: 70, height: 70,
            borderRadius: 90
          }}
        >
          {item?.topic ? (
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT! + item?.topic?.image}` || item?.topic?.image || "" }}
              style={{ width: 70, height: 70, borderRadius: 90 }}
            />
          ) : (
            <MaterialIcons name="payments" size={45} color="white" />
          )}
        </View>
        <View style={{
          flex: 1,
          flexWrap: "wrap",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start"
        }}>
          <Text style={{ color: "white", fontSize: 18, fontWeight: "bold" }}>{item?.topic ? item?.topic?.name : localStrings.Transaction.TopupPoint}</Text>
          <View style={{ flex: 1, width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1, width: "100%", flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: item?.action ? "palegreen" : redError, fontSize: 18, fontWeight: "bold", marginRight: 10 }}>
                {(item?.action ? "+" : "-") + item?.point}
              </Text>
              <FontAwesome6 name="coins" size={20} color={"yellow"} />
            </View>
            <Text style={{ color: "white", fontSize: 12, opacity: 0.6, fontWeight: "semibold" }}>{dayjs(item?.createdAt).format("DD/MM/YYYY HH:mm")}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <Screen
      header={() => (
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <TouchableOpacity
            style={{ height: 40 }}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back-ios" size={24} color="white" />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "space-between" }}>
            <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", height: 40 }}>{localStrings.Profile.TransHistory}</Text>
          </View>
        </View>
      )}
    >
      <View
        style={{
          width: "100%",
          paddingHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "space-between"
        }}
      >
        {filter.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={{
              borderColor: brandPrimaryTap,
              backgroundColor: query?.type === item.value ? brandPrimaryTap : brandPrimaryDark,
              borderWidth: query?.type === item.value ? 0 : 1,
              marginVertical: 10,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
            onPress={() => setQuery((prev) => ({ ...prev, type: item.value === "" ? undefined : item.value }))}
          >
            {query?.type === item.value && <Entypo name='check' size={20} color='white' />}
            <Text style={{ color: 'white', marginLeft: 5, fontWeight: 'bold' }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={billList}
        style={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?._id || ""}
        renderItem={({ item }) => {
          return (
            <>
              {item?.type === "package"
                ? <PackageBill item={item} key={item?._id as string} />
                : <PointBill item={item} key={item?._id as string} />
              }
            </>
          );
        }}
        onEndReached={getMoreChats}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading && billList && billList?.length > 10
          ? <ActivityIndicator size="large" color="white" style={{ marginVertical: 30 }} />
          : <View style={{ height: 40 }}></View>
        }
      />
    </Screen>
  )
}

export default TransactionHistoryScreen