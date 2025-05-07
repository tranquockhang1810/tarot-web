import { useAuth } from "@/context/auth/useAuth";
import useColor from "@/hooks/useColor";
import { showToast } from "@/utils/helper/SendMessage";
import { Spin, Image } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import HoroscopeDetailViewModel from "../viewModel/HoroscopeDetailViewModel";
import {
  AiFillStar,
  AiFillHeart
} from "react-icons/ai";
import {
  MdWork,
  MdAttachMoney,
  MdMedicalServices
} from "react-icons/md";
import { GiClover } from "react-icons/gi";

const HoroscopeDetailView = ({ date, className }: { date: string, className?: string }) => {
  const { localStrings } = useAuth();
  const { redError, brandPrimary, blue } = useColor();
  const { horoscope, loading, resultObject } = HoroscopeDetailViewModel(date);

  useEffect(() => {
    if (resultObject?.type) {
      showToast({
        type: resultObject?.type,
        content: resultObject?.content,
      });
    }
  }, [resultObject]);

  if (loading || !horoscope) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={`${className} w-full flex flex-col items-center"`}>
      {/* Content */}
      <div
        className="w-full bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg text-white"
        style={{ backgroundColor: brandPrimary }}
      >
        <h1 className="text-white font-bold text-lg text-center md:text-start flex-1">
          {`${horoscope?.zodiac} - ${dayjs(date).format("DD/MM/YYYY")}`}
        </h1>

        {/* Title */}
        <div className="flex items-center md:justify-start justify-center gap-2 my-4">
          <AiFillStar style={{ color: blue, fontSize: 24 }} />
          <span className="text-xl font-bold">{localStrings?.Horoscope?.InterpretingDestiny}</span>
          <AiFillStar style={{ color: blue, fontSize: 24 }} />
        </div>
        <p className="text-base mb-6">{horoscope?.summary}</p>

        {/* Love */}
        <Section
          icon={<AiFillHeart color={redError} size={24} />}
          title={localStrings?.Horoscope?.Love}
          content={horoscope?.love}
        />

        {/* Career */}
        <Section
          icon={<MdWork color="#F0E68C" size={24} />}
          title={localStrings?.Horoscope?.Career}
          content={horoscope?.career}
        />

        {/* Finance */}
        <Section
          icon={<MdAttachMoney color="palegreen" size={24} />}
          title={localStrings?.Horoscope?.Finance}
          content={horoscope?.finance}
        />

        {/* Health */}
        <Section
          icon={<MdMedicalServices color={redError} size={24} />}
          title={localStrings?.Horoscope?.Health}
          content={horoscope?.health}
        />

        {/* Luck */}
        <div className="mt-8">
          <div className="flex items-center md:justify-start justify-center gap-2 mb-2">
            <GiClover color="palegreen" size={24} />
            <span className="text-xl font-bold">{localStrings?.Horoscope?.Luck}</span>
            <GiClover color="palegreen" size={24} />
          </div>

          {/* Lucky Color */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base">{localStrings?.Horoscope?.LuckyColor}:</span>
            <div
              className="w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: horoscope?.luckyColor?.code }}
            />
            <span className="text-base">{horoscope?.luckyColor?.name}</span>
          </div>

          {/* Lucky Number */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base">{localStrings?.Horoscope?.LuckyNumber}:</span>
            <span className="text-base">{horoscope?.luckyNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Section = ({
  icon,
  title,
  content,
}: {
  icon: React.ReactNode;
  title?: string;
  content?: string;
}) => {
  return (
    <div className="my-6">
      <div className="flex items-center md:justify-start justify-center gap-2 mb-2">
        {icon}
        <span className="text-xl font-bold">{title}</span>
        {icon}
      </div>
      <p className="text-base">{content}</p>
    </div>
  );
};

export default HoroscopeDetailView;
