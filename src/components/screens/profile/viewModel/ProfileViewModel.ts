import { ResultObject } from "@/src/api/baseApiResponseModel/baseApiResponseModel";
import { useAuth } from "@/src/context/auth/useAuth";
import { useRef, useState } from "react";
import dayjs from 'dayjs';
import { defaultProfileRepo } from "@/src/api/features/profile/ProfileRepo";
import { UpdateUserRequestModel } from "@/src/api/features/profile/models/UpdateUserModel";
import * as ImagePicker from 'expo-image-picker';
import { convertMediaToFiles } from "@/src/utils/helper/TransferToFormData";
import { ImagePickerAsset } from "expo-image-picker";

const ProfileViewModel = () => {
  const [resultObject, setResultObject] = useState<ResultObject | null>(null);
  const { localStrings, user, onUpdateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [selectedGender, setSelectedGender] = useState<"male" | "female">(user?.gender || 'male');
  const [selectedBirthDate, setSelectedBirthDate] = useState(dayjs(user?.birthDate).toDate() || new Date());
  const [datePickerModal, setDatePickerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<ImagePickerAsset | null>(null);

  const resetForm = () => {
    setEditMode(false)
    setNewName(user?.name || '');
    setSelectedGender(user?.gender || 'male');
    setSelectedBirthDate(dayjs(user?.birthDate).toDate() || new Date());
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setEditMode(false);
      const newAvatar = image && await convertMediaToFiles([image]) || [];
      const params: UpdateUserRequestModel = {
        name: newName || undefined,
        birthDate: dayjs(selectedBirthDate).format('YYYY-MM-DD') || undefined,
        gender: selectedGender || undefined,
        avatar: newAvatar.length > 0 ? newAvatar[0] : undefined
      }
      const res = await defaultProfileRepo.updateProfile(params);
      if (res?.data) {
        setResultObject({
          type: 'success',
          title: localStrings.Setting.UpdateProfileSuccess,
        });
        onUpdateProfile(res?.data);
        setEditMode(false);
      } else {
        setEditMode(true);
        setResultObject({
          type: 'error',          
          title: localStrings.Setting.UpdateProfileFailed,
          content: res?.message
        });
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