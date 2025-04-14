import { View, Text, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import Screen from '@/src/components/layout/Screen'
import { useAuth } from '@/src/context/auth/useAuth';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Image } from 'expo-image';
import { AVARTAR_IMAGE } from '@/src/consts/ImgPath';
import useColor from '@/src/hooks/useColor';
import dayjs from 'dayjs';
import { Button } from '@ant-design/react-native';
import ProfileViewModel from '../../viewModel/ProfileViewModel';
import { showToast } from '@/src/utils/helper/SendMessage';
import DatePicker from 'react-native-date-picker';

const UpdateProfileScreen = () => {
  const { localStrings, user } = useAuth();
  const { brandPrimaryTap, brandPrimaryDark, redError } = useColor();
  const {
    editMode, setEditMode,
    resultObject,
    newName, setNewName,
    selectedGender, setSelectedGender,
    selectedBirthDate, setSelectedBirthDate,
    datePickerModal, setDatePickerModal,
    resetForm,
    handleUpdateProfile,
    loading,
    image, pickImage
  } = ProfileViewModel();

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
    <Screen
      header={() => (<></>)}
      headerBackgroundColor='none'
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
              {/* Header */}
              <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                <TouchableOpacity
                  style={{ height: 40 }}
                  onPress={() => router.back()}
                >
                  <MaterialIcons name="arrow-back-ios" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1, justifyContent: "space-between" }}>
                  <Text style={{ color: "white", fontSize: 18, fontWeight: "bold", height: 40 }}>{localStrings.Setting.Title}</Text>
                </View>
              </View>

              {/* Avatar */}
              <View style={{ alignItems: "center", justifyContent: "center", flexWrap: "wrap", flexDirection: "row", zIndex: 3 }}>
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                  <Image
                    source={{ uri: image?.uri! || `${user?.avatar}` || AVARTAR_IMAGE }}
                    style={{ width: 140, height: 140, borderRadius: 90, position: "relative", borderColor: "white", borderWidth: 5 }}
                  />
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 10,
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: brandPrimaryDark,
                      justifyContent: "center",
                      alignItems: "center",
                      display: editMode ? "flex" : "none"
                    }}
                    onPress={() => editMode && pickImage()}
                  >
                    <MaterialIcons name="photo-camera" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Content */}
              <View
                style={{
                  paddingHorizontal: 20, marginTop: -70,
                  paddingTop: 50,
                  paddingBottom: 40,
                  backgroundColor: brandPrimaryTap,
                  borderRadius: 15,
                }}
              >
                {/* Name */}
                <>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 24,
                      fontWeight: "bold",
                    }}
                  >
                    {localStrings.Register.Label.Fullname}
                  </Text>
                  <TextInput
                    style={{
                      width: "100%",
                      marginTop: 10,
                      marginBottom: 10,
                      minHeight: 50,
                      backgroundColor: brandPrimaryDark,
                      color: "white",
                      padding: 15,
                      borderRadius: 10,
                      fontSize: 20,
                      fontWeight: "bold"
                    }}
                    editable={editMode}
                    onEndEditing={(e: any) => setNewName(e.nativeEvent.text.trim())}
                    defaultValue={newName}
                    placeholder={localStrings.Create.QuestionPlaceholder}
                    placeholderTextColor="#ccc"
                  />
                </>

                {/* Phone */}
                {user?.type === "phone" && (
                  <>
                    <Text
                      style={{
                        color: "white",
                        fontSize: 24,
                        fontWeight: "bold",
                        marginTop: 15
                      }}
                    >
                      {localStrings.Register.Label.Phone}
                    </Text>
                    <TextInput
                      style={{
                        width: "100%",
                        marginTop: 10,
                        marginBottom: 10,
                        minHeight: 50,
                        backgroundColor: brandPrimaryDark,
                        color: "white",
                        padding: 15,
                        borderRadius: 10,
                        fontSize: 20,
                        fontWeight: "bold",
                        opacity: editMode ? 0.8 : 1
                      }}
                      editable={false}
                      defaultValue={user?.phone}
                      placeholder={localStrings.Create.QuestionPlaceholder}
                      placeholderTextColor="#ccc"
                    />
                  </>
                )}

                {/* Birthday */}
                <>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 24,
                      fontWeight: "bold",
                      marginTop: 15
                    }}
                  >
                    {localStrings.Register.Label.Birthday}
                  </Text>
                  <TouchableOpacity
                    style={{
                      width: "100%",
                      marginTop: 10,
                      marginBottom: 10,
                      minHeight: 50,
                      backgroundColor: brandPrimaryDark,
                      padding: 15,
                      borderRadius: 10,
                      pointerEvents: editMode ? 'auto' : 'none'
                    }}
                    onPress={() => {
                      if (editMode) {
                        setDatePickerModal(true);
                      }
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
                      {dayjs(selectedBirthDate).format("DD/MM/YYYY")}
                    </Text>
                  </TouchableOpacity>
                </>

                {/* Gender */}
                <>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 24,
                      fontWeight: "bold",
                      marginTop: 15,
                      marginBottom: 10
                    }}
                  >
                    {localStrings.Register.Label.Gender}
                  </Text>
                  {editMode ? (
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <Button
                        type={selectedGender === 'male' ? 'primary' : 'ghost'}
                        style={{ width: editMode ? '48%' : '100%', height: 70 }}
                        styles={{ primaryRaw: { backgroundColor: brandPrimaryDark }, ghostRaw: { borderColor: brandPrimaryDark } }}
                        onPress={() => {
                          setSelectedGender('male')
                        }}>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                          <Ionicons name="male" size={30} color="white" />
                          <Text style={{ color: 'white', marginTop: 5, fontWeight: 'bold' }}>{localStrings.Register.Label.Male}</Text>
                        </View>
                      </Button>
                      <Button
                        type={selectedGender === 'female' ? 'primary' : 'ghost'}
                        style={{ width: editMode ? '48%' : '100%', height: 70, marginLeft: '4%' }}
                        styles={{ primaryRaw: { backgroundColor: brandPrimaryDark }, ghostRaw: { borderColor: brandPrimaryDark } }}
                        onPress={() => {
                          setSelectedGender('female')
                        }}>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                          <Ionicons name="female" size={30} color="white" />
                          <Text style={{ color: 'white', marginTop: 5, fontWeight: 'bold' }}>{localStrings.Register.Label.Female}</Text>
                        </View>
                      </Button>
                    </View>
                  ) : (
                    <View
                      style={{
                        justifyContent: 'center', alignItems: 'center', height: 70,
                        backgroundColor: brandPrimaryDark, borderRadius: 10
                      }}
                    >
                      <View style={{ flexDirection: 'column', alignItems: 'center' }} >
                        <Ionicons name={user?.gender} size={30} color="white" />
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>
                          {user?.gender === 'female'
                            ? localStrings.Register.Label.Female
                            : localStrings.Register.Label.Male}
                        </Text>
                      </View>
                    </View>
                  )}
                </>
              </View>

              {/* Footer */}
              {!editMode && !loading ? (
                <TouchableOpacity
                  style={{
                    width: "100%",
                    height: 60,
                    marginTop: 15,
                    borderRadius: 15,
                    backgroundColor: brandPrimaryTap,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    pointerEvents: loading ? 'none' : 'auto'
                  }}
                  onPress={() => {
                    setEditMode(true)
                  }}
                >
                  <MaterialIcons name="edit" size={30} color="white" />
                  <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>{localStrings.GLobals.Edit}</Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                  <TouchableOpacity
                    style={{
                      width: "48%",
                      height: 60,
                      marginTop: 15,
                      borderRadius: 15,
                      backgroundColor: redError,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      pointerEvents: loading ? 'none' : 'auto'
                    }}
                    onPress={resetForm}
                  >
                    <MaterialIcons name="cancel" size={30} color="white" />
                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>{localStrings.GLobals.Cancel}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: "48%",
                      height: 60,
                      marginTop: 20,
                      borderRadius: 15,
                      backgroundColor: brandPrimaryTap,
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "row"
                    }}
                    onPress={handleUpdateProfile}
                  >
                    {loading ? <ActivityIndicator size="small" color="white" /> : (
                      <>
                        <MaterialIcons name="save" size={30} color="white" />
                        <Text style={{ color: "white", fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>{localStrings.GLobals.Confirm}</Text>
                      </>
                    )}

                  </TouchableOpacity>
                </View>
              )}
              {datePickerModal && <DatePicker
                date={selectedBirthDate}
                modal
                mode='date'
                open={datePickerModal}
                onConfirm={(date) => {
                  setSelectedBirthDate(date)
                  setDatePickerModal(false)
                }}
                onCancel={() => {
                  setDatePickerModal(false)
                }}
                cancelText={localStrings.GLobals.Cancel}
                confirmText={localStrings.GLobals.Confirm}
                title={localStrings.Register.Label.Birthday}
                maximumDate={new Date()}
              />}
            </ScrollView>
          </>
        </TouchableWithoutFeedback>
        <Toast />
      </KeyboardAvoidingView>
    </Screen >
  )
}

export default UpdateProfileScreen