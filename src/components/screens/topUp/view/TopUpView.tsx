"use client"
import { useEffect } from "react";
import { useAuth } from "@/context/auth/useAuth";
import { Button, Spin, Typography, Card, Row, Col, Image, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { FaCoins } from "react-icons/fa6";
import { MOMO_IMAGE } from "@/consts/ImgPath";
import useColor from "@/hooks/useColor";
import { CurrencyFormat } from "@/utils/helper/CurrencyFormat";
import TopUpViewModel from "../viewModel/TopUpViewModel";
import { useRouter } from "next/navigation";
import { showToast } from "@/utils/helper/SendMessage";

const { Title } = Typography;
const TopUpView = () => {
  const { localStrings, user } = useAuth();
  const { brandPrimaryDark, brandPrimary, brandPrimaryTap } = useColor();
  const router = useRouter();

  const {
    resultObject,
    packageLoading,
    packages,
    selectedPackage,
    setSelectedPackage,
    paymentLoading,
    createBill,
  } = TopUpViewModel();

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        content: resultObject?.content
      });
    }
  }, [resultObject]);

  return (
    <div className="max-h-screen p-6 text-white overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Title level={4} className="!text-white !mb-0">
            {localStrings.Topup.Title}
          </Title>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{user?.point}</span>
          <FaCoins className="text-yellow-400 text-xl" />
        </div>
      </div>

      {/* Content */}
      {packageLoading ? (
        <div className="flex justify-center items-center h-[60vh]">
          <Spin size="large" />
        </div>
      ) : (
        <div className="flex flex-col justify-between gap-8">
          {/* Package List */}
          <Row gutter={[16, 16]}>
            {packages?.map((item) => (
              <Col key={item._id} span={12}>
                <Card
                  onClick={() => setSelectedPackage(item)}
                  hoverable
                  className={`rounded-xl text-white text-center transition-all`}
                  style={{
                    backgroundColor: selectedPackage?._id === item._id
                      ? brandPrimary
                      : brandPrimaryDark,
                    borderColor: brandPrimary
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-white">{item.point}</span>
                      <FaCoins className="text-yellow-400 text-3xl" />
                    </div>
                    <div className="text-lg font-bold text-white">{CurrencyFormat(Number(item.price))}</div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Button + MoMo */}
          <Button
            type="primary"
            size="large"
            disabled={!selectedPackage}
            loading={paymentLoading}
            className="w-full !h-[60px] rounded-xl font-bold text-lg"
            style={{ backgroundColor: brandPrimary }}
            onClick={() => createBill(selectedPackage?._id || "")}
            icon={<Image
              src={MOMO_IMAGE}
              preview={false}
              width={40}
              height={40}
              className="rounded-xl border-2 border-white"
              alt="MoMo Logo"
            />}
          >
            {localStrings.Topup.Pay}
          </Button>
        </div>
      )}
    </div>
  );
}

export default TopUpView