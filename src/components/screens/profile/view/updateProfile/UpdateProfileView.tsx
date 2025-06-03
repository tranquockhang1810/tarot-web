import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import { Button, DatePicker, Form, Image, Input, Modal, Radio, Upload } from "antd"
import dayjs from "dayjs";
import { AiOutlineClose, AiOutlineEdit, AiOutlineLogout, AiOutlineSave, AiOutlineUpload } from "react-icons/ai";
import ProfileViewModel from "../../viewModel/ProfileViewModel";
import { useEffect, useState } from "react";
import { RcFile } from "antd/es/upload";
import { showToast } from "@/utils/helper/SendMessage";
import { IoLogOut } from "react-icons/io5";
import { GrLanguage } from "react-icons/gr";
import { AVARTAR_IMAGE } from '@/consts/ImgPath';

const UpdateProfileView = ({
  open,
  onCancel,
}: {
  open: boolean,
  onCancel: () => void,
}) => {
  const { localStrings, user, onLogout, changeLanguage } = useAuth();
  const { brandPrimaryTap, brandPrimaryDark, redError } = useColor();
  const [form] = Form.useForm();
  const {
    editMode, setEditMode,
    handleUpdateProfile,
    resetForm, loading, resultObject
  } = ProfileViewModel();
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        content: resultObject?.content
      });
    }
  }, [resultObject]);

  return (
    <Modal
      open={open}
      onCancel={() => {
        form.resetFields();
        resetForm();
        onCancel();
      }}
      title={<span className="text-white">{localStrings.Setting.Title}</span>}
      footer={null}
      width={600}
      centered
      styles={{
        content: { background: brandPrimaryDark },
        header: { background: brandPrimaryDark },
      }}
      destroyOnClose
      closeIcon={<AiOutlineClose className="text-white" />}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: user?.name,
          phone: user?.phone,
          birthDate: dayjs(user?.birthDate) || dayjs(),
          gender: user?.gender,
        }}
        onFinish={(values) => handleUpdateProfile(values)}
        requiredMark={false}
      >
        <Form.Item
          name="avatar"
          valuePropName="file"
          className="flex items-center justify-center"
        >
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              if (!isImage) {
                showToast({
                  type: 'error',
                  content: localStrings?.GLobals?.InvalidImage || 'File không hợp lệ. Vui lòng chọn ảnh.',
                });
                return Upload.LIST_IGNORE;
              }
              const previewUrl = URL.createObjectURL(file as RcFile);
              setImageUrl(previewUrl);
              return false;
            }}
            onChange={(info) => {
              const { file } = info;
              const previewUrl = URL.createObjectURL(file as RcFile);
              setImageUrl(previewUrl);
            }}
            openFileDialogOnClick={editMode}
          >
            <div className="relative w-36 h-36 mx-auto mb-4">
              <Image
                src={imageUrl || user?.avatar || AVARTAR_IMAGE}
                className="rounded-full border-4"
                style={{ borderColor: 'white', objectFit: 'cover' }}
                preview={editMode ? false : { mask: null }}
                alt="avatar"
                height={144}
                width={144}
              />
              {editMode && (
                <div
                  className="absolute  hover:cursor-pointer bottom-0 right-0 bg-primary-dark w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: brandPrimaryDark }}
                >
                  <AiOutlineUpload className="text-white text-lg" />
                </div>
              )}
            </div>
          </Upload>
        </Form.Item>

        <Form.Item
          label={<span className="text-white font-bold text-lg">{localStrings.Register.Label.Fullname}</span>}
          name="name"
          rules={[{ required: true, message: localStrings.Register.Messages.FullnameRequired }]}
        >
          <Input
            className="text-lg"
            readOnly={!editMode}
          />
        </Form.Item>

        {user?.type === 'phone' && (
          <Form.Item
            label={<span className="text-white font-bold text-lg">{localStrings.Register.Label.Phone}</span>}
            name="phone"
          >
            <Input readOnly className="text-white font-bold text-lg" />
          </Form.Item>
        )}

        <Form.Item
          label={<span className="text-white font-bold text-lg">{localStrings.Register.Label.Birthday}</span>}
          name="birthDate"
          rules={[{ required: true, message: localStrings.Register.Messages.BirthdayRequired }]}
        >
          <DatePicker
            className="w-full"
            readOnly={!editMode}
            format="DD/MM/YYYY"
            allowClear={false}
            disabledDate={(current) => current && current > dayjs()}
            inputReadOnly
          />
        </Form.Item>

        <Form.Item
          label={<span className="text-white font-bold text-lg">{localStrings.Register.Label.Gender}</span>}
          name="gender"
        >
          <Radio.Group
            style={{ pointerEvents: !editMode ? 'none' : 'auto' }}
            className="text-white"
            block
            buttonStyle="solid"
          >
            <Radio.Button value="male" className="mr-4 text-white">
              {localStrings.Register.Label.Male}
            </Radio.Button>
            <Radio.Button value="female" className="text-white">
              {localStrings.Register.Label.Female}
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <div className="flex justify-end gap-4 mt-6">
          {editMode ? (
            <>
              <Button
                danger
                icon={<AiOutlineClose />}
                style={{ backgroundColor: redError, color: 'white' }}
                onClick={
                  () => setEditMode(false)
                }
              >
                {localStrings.GLobals.Cancel}
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<AiOutlineSave />}
                style={{ backgroundColor: brandPrimaryTap, color: 'white' }}
                loading={loading}
              >
                {localStrings.GLobals.Confirm}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="primary"
                danger
                icon={<IoLogOut />}
                onClick={() => Modal.confirm({
                  title: localStrings.GLobals.Logout,
                  content: localStrings.GLobals.LogoutMessage,
                  okText: localStrings.GLobals.Logout,
                  okButtonProps: { danger: true },
                  cancelText: localStrings.GLobals.Cancel,
                  onOk: () => onLogout(),
                })}
              >
                {localStrings.GLobals.Logout}
              </Button>
              <Button
                icon={<GrLanguage />}
                type="default"
                ghost
                onClick={changeLanguage}
              >
                {localStrings.GLobals.Language}
              </Button>
              <Button
                type="primary"
                icon={<AiOutlineEdit />}
                onClick={() => setEditMode(true)}
              >
                {localStrings.GLobals.Edit}
              </Button>
            </>
          )}
        </div>
      </Form>
    </Modal>
  )
}

export default UpdateProfileView