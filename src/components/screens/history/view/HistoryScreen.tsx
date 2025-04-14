import { FlatList, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import Screen from "@/src/components/layout/Screen";
import { Button, Checkbox, Drawer, Modal, Radio, SwipeAction, SwipeoutButtonProps } from "@ant-design/react-native";
import { Image } from "expo-image";
import useColor from "@/src/hooks/useColor";
import { MaterialIcons, Feather, Octicons } from "@expo/vector-icons";
import HistoryViewModel from "../viewModel/HistoryViewModel";
import { showToast } from "@/src/utils/helper/SendMessage";
import Toast from "react-native-toast-message";
import { useAuth } from "@/src/context/auth/useAuth";
import DatePicker from "react-native-date-picker";
import { router } from "expo-router";
import MyInput from "@/src/components/foundation/MyInput";
import { GetRemainingDay } from "@/src/utils/helper/DateTransfer";
import dayjs from "dayjs";
import { TopicsType } from "@/src/api/features/topic/models/TopicModel";

const HistoryScreen = () => {
  const { brandPrimary, violet, brandPrimaryTap, orange, redError } = useColor();
  const { localStrings, language } = useAuth();
  const {
    resultObject,
    listLoading,
    listChats,
    getMoreChats,
    topics,
    showFilter,
    setShowFilter,
    topicRefs,
    handleApply,
    refreshListChats,
    refreshing,
    fromDate, setFromDate,
    toDate, setToDate,
    openFrom, setOpenFrom,
    openTo, setOpenTo,
    statusRefs,
    statusList,
    resetFilter,
    resetFlag,
    dateFilterType, setDateFilterType,
    deleteChat,
    deleteLoading,
    selectedChat, setSelectedChat
  } = HistoryViewModel();

  const header = () => (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: brandPrimary,
          borderRadius: 10,
          paddingHorizontal: 10,
          height: 40,
          flex: 1,
        }}
      >
        <MaterialIcons name="search" size={20} color="white" />
        <MyInput
          placeholder={localStrings.History.FindText}
          style={{ marginLeft: 10, flex: 1 }}
          inputStyle={{ color: "white" }}
        />
      </View>
      <Button style={{ marginLeft: 15, borderRadius: 10, height: 40 }} type="primary" onPress={() => setShowFilter(!showFilter)}>
        <MaterialIcons name="filter-list-alt" size={24} color="white" />
      </Button>
    </View>
  );

  const sider = (
    <View
      style={{
        height: dateFilterType === "range" ? 430 : 400,
        width: 280,
        backgroundColor: brandPrimaryTap,
        marginTop: 20,
        borderRadius: 20,
        marginRight: 20,
        padding: 20,
      }}
    >
      {/* Chủ đề */}
      <Text style={{ fontSize: 16, color: 'white', marginBottom: 5, fontWeight: 'bold' }}>{localStrings.GLobals.Topic}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {topics.map((topic) => (
          <Checkbox
            key={`${topic?._id}-${resetFlag}`}
            defaultChecked={false}
            onChange={(e) => {
              topicRefs.current[topic?._id as string] = e.target.checked;
            }}
            style={{ marginBottom: 5, marginRight: 10 }}
          >
            <Text style={{ color: 'white' }}>{(localStrings.Topics as TopicsType)[topic?.code || ""]}</Text>
          </Checkbox>
        ))}
      </View>

      {/* Ngày tạo */}
      <Text style={{ fontSize: 16, color: 'white', marginBottom: 5, marginTop: 20, fontWeight: 'bold' }}>
        {localStrings.GLobals.CreatedDate}
      </Text>

      <Radio.Group
        defaultValue={"all"}
        key={`CreatedDate - ${resetFlag}`}
        onChange={(e) => {
          setDateFilterType(e.target.value as string);
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <Radio value="all">
            <Text style={{ color: "white", marginLeft: 5 }}>{localStrings.GLobals.All}</Text>
          </Radio>
          <Radio value="range">
            <Text style={{ color: "white", marginLeft: 5 }}>{localStrings.GLobals.DateRange}</Text>
          </Radio>
        </View>
      </Radio.Group>

      {dateFilterType === "range" && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
          <>
            <TouchableOpacity onPress={() => setOpenFrom(true)}>
              <Text style={{ color: "white" }}>{dayjs(fromDate).format("DD/MM/YYYY")}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={openFrom}
              date={fromDate}
              onConfirm={(date) => {
                setOpenFrom(false);
                setFromDate(date);
              }}
              onCancel={() => setOpenFrom(false)}
              minimumDate={new Date(2021, 0, 1)}
              maximumDate={toDate}
              title={localStrings.GLobals.FromDate}
              confirmText={localStrings.GLobals.Confirm}
              cancelText={localStrings.GLobals.Cancel}
            />
          </>
          <Feather name="arrow-right" color={"white"} size={16} />
          <>
            <TouchableOpacity onPress={() => setOpenTo(true)}>
              <Text style={{ color: "white" }}>{dayjs(toDate).format("DD/MM/YYYY")}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={openTo}
              date={toDate}
              onConfirm={(date) => {
                setOpenTo(false);
                setToDate(date);
              }}
              onCancel={() => setOpenTo(false)}
              minimumDate={fromDate}
              maximumDate={new Date()}
              title={localStrings.GLobals.ToDate}
              confirmText={localStrings.GLobals.Confirm}
              cancelText={localStrings.GLobals.Cancel}
            />
          </>
        </View>
      )}

      {/* Thời hạn */}
      <Text style={{ fontSize: 16, color: 'white', marginBottom: 5, marginTop: 20, fontWeight: 'bold' }}>{localStrings.GLobals.RemainDay}</Text>
      <Radio.Group
        defaultValue={""}
        key={`Status - ${resetFlag}`}
        onChange={(e) => {
          statusRefs.current = e.target.value as string;
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start", flexWrap: "wrap", gap: 15 }}>
          {statusList.map((status) => (
            <Radio key={status.value} value={status.value} style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "white", marginLeft: 5 }}>{status.label}</Text>
            </Radio>
          ))}
        </View>
      </Radio.Group>

      {/* Button áp dụng */}
      <Button type="primary" style={{ marginTop: 20 }} onPress={handleApply}>
        {localStrings.GLobals.Apply}
      </Button>

      {/* Button reset */}
      <TouchableOpacity style={{ marginTop: 20 }} onPress={resetFilter}>
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>{localStrings.GLobals.Delete}</Text>
      </TouchableOpacity>
    </View>
  )

  const right: SwipeoutButtonProps[] = [
    {
      text: (
        <>
          {deleteLoading ? (
            <ActivityIndicator size="large" color="white" style={{ marginVertical: 30 }} />
          ) : (
            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <MaterialIcons name="delete" size={24} color="white" />
              <Text style={{ color: 'white', fontSize: 10 }}>{localStrings?.GLobals?.Delete}</Text>
            </View>
          )}
        </>
      ),
      onPress: () => {
        Modal.alert(
          localStrings?.GLobals?.Delete,
          localStrings?.GLobals?.DeleteChat,
          [
            { text: localStrings?.GLobals?.Cancel, style: 'cancel' },
            { text: localStrings?.GLobals?.Delete, onPress: () => { selectedChat?._id && deleteChat(selectedChat?._id) } },
          ]
        )
      },
      actionButtonProps: {
        style: {
          backgroundColor: redError,
          borderRadius: 10,
          marginRight: 20,
          marginVertical: 20,
          justifyContent: 'center',
          alignItems: 'center',
          height: 60,
          width: 80,
        },
      },
    },
  ];

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        title: resultObject?.title,
        content: resultObject?.content
      });
    }
  }, [resultObject]);

  return (
    <Screen header={header}>
      <Drawer
        open={showFilter}
        position="right"
        drawerWidth={300}
        onOpenChange={(isOpen) => setShowFilter(isOpen)}
        sidebar={sider}>
        <FlatList
          data={listChats}
          style={{ marginBottom: 65 }}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item?._id || ""}
          renderItem={({ item }) => {
            const { createdDate, remaining } = GetRemainingDay(item?.createdAt, localStrings, language);
            return (
              <SwipeAction
                right={right}
                closeOnAction
                closeOnTouchOutside
                key={item?._id}
                onSwipeableOpen={() => setSelectedChat(item)}
              >
                <TouchableOpacity onPress={() => router.push(`/(routes)/chat/${item?._id}`)}>
                  <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 20 }}>
                    <Image source={{ uri: `${process.env.EXPO_PUBLIC_SERVER_ENDPOINT! + item.topic?.image}` }} style={{ width: 60, height: 60, borderRadius: 50 }} />
                    <View style={{ flex: 1, marginLeft: 15, backgroundColor: violet, padding: 10, borderRadius: 10 }}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <Text style={{ color: "white", opacity: 0.6, fontSize: 12 }}>{createdDate}</Text>
                        <Text style={{ color: "white", opacity: 0.6, fontSize: 12 }}>
                          {remaining}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text
                          style={{
                            color: "white",
                            opacity: item?.latestMessage?.status === false ? 0.8 : 0.5,
                            fontSize: 13,
                            fontWeight: item?.latestMessage?.status === false ? "bold" : "normal"
                          }}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.latestMessage?.message || item?.question}
                        </Text>
                        {item?.latestMessage?.status === false && (
                          <Octicons
                            name="dot-fill"
                            size={14}
                            color={redError}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </SwipeAction>
            );
          }}
          onEndReached={getMoreChats}
          onEndReachedThreshold={0.1}
          ListFooterComponent={listLoading && listChats && listChats?.length > 12
            ? <ActivityIndicator size="large" color="white" style={{ marginVertical: 30 }} />
            : <View style={{ height: 40 }}></View>
          }
          refreshing={refreshing}
          onRefresh={refreshListChats}
        />
      </Drawer>
      <Toast />
    </Screen>
  );
};

export default HistoryScreen;
