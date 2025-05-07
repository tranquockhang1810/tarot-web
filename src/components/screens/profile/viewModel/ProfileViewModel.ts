import { ResultObject } from "@/api/baseApiResponseModel/baseApiResponseModel";
import { useAuth } from "@/context/auth/useAuth";
import { useRef, useState } from "react";
import dayjs from 'dayjs';
import { defaultProfileRepo } from "@/api/features/profile/ProfileRepo";
import { UpdateUserRequestModel } from "@/api/features/profile/models/UpdateUserModel";
import { RcFile } from "antd/es/upload";

const ProfileViewModel = () => {
  const [resultObject, setResultObject] = useState<ResultObject | null>(null);
  const { localStrings, user, onUpdateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [selectedGender, setSelectedGender] = useState<"male" | "female">(user?.gender || 'male');
  const [selectedBirthDate, setSelectedBirthDate] = useState(dayjs(user?.birthDate).toDate() || new Date());
  const [datePickerModal, setDatePickerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<RcFile | null>(null);

  const resetForm = () => {
    setEditMode(false)
    setNewName(user?.name || '');
    setSelectedGender(user?.gender || 'male');
    setSelectedBirthDate(dayjs(user?.birthDate).toDate() || new Date());
  }

  const pickImage = async () => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ['images'],
    //   allowsEditing: true,
    //   aspect: [1, 1],
    //   quality: 1,
    // });

    // console.log(result);

    // if (!result.canceled) {
    //   setImage(result.assets[0]);
    // }
  };

  const handleUpdateProfile = async (values: any) => {
    try {
      setLoading(true);
      const params: UpdateUserRequestModel = {
        name: values?.name || undefined,
        birthDate: dayjs(values?.birthDate).format('YYYY-MM-DD') || undefined,
        gender: values?.gender || undefined,
        avatar: values?.avatar?.file || undefined
      }
      const res = await defaultProfileRepo.updateProfile(params);
      if (res?.data) {
        setResultObject({
          type: 'success',
          content: localStrings.Setting.UpdateProfileSuccess,
        });
        onUpdateProfile(res?.data);
        setEditMode(false);
      } else {
        setEditMode(true);
        setResultObject({
          type: 'error',          
          content: localStrings.Setting.UpdateProfileFailed + ': ' + res?.message,
        });
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

  return {
    editMode, setEditMode,
    resultObject,
    newName, setNewName,
    selectedGender, setSelectedGender,
    selectedBirthDate, setSelectedBirthDate,
    datePickerModal, setDatePickerModal,
    resetForm,
    handleUpdateProfile, loading,
    image, pickImage
  }
}

export default ProfileViewModel