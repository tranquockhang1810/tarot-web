import { ENGLocalizedStrings } from '../localizedStrings/english/index';
import { VnLocalizedStrings } from '../localizedStrings/vietnam/index';
import dayjs from "dayjs";

export const GetRemainingDay = (
  createdAt: string | undefined,
  localStrings: typeof VnLocalizedStrings | typeof ENGLocalizedStrings,
  language: string
) => {
  if (!createdAt) return { createdDate: "", remaining: localStrings?.GLobals?.Closed };

  // Chuyển ngày tạo về 00:00
  const createdDate = new Date(createdAt);
  createdDate.setHours(0, 0, 0, 0);

  // Ngày hết hạn (sau 4 ngày, vào 00:00)
  const expiryDate = new Date(createdDate);
  expiryDate.setDate(expiryDate.getDate() + 4);
  expiryDate.setHours(0, 0, 0, 0);

  // Lấy thời gian hiện tại (giữ nguyên giờ để tính chênh lệch giờ chính xác)
  const now = new Date();

  // Tính số mili-giây còn lại
  const timeDiff = expiryDate.getTime() - now.getTime();

  if (timeDiff <= 0) {
    return { createdDate: dayjs(createdDate).format("DD/MM/YYYY"), remaining: localStrings?.GLobals?.Closed };
  }

  const remainingDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  if (remainingDays >= 1) {
    return {
      createdDate: dayjs(createdDate).format("DD/MM/YYYY"),
      remaining: `${localStrings?.GLobals?.Remain} ${remainingDays} ${localStrings.GLobals.Day.toLowerCase() + (language === 'en' ? "s" : "")}`,
    };
  } else {
    // Nếu còn dưới 1 ngày, tính giờ, phút chính xác dựa trên thời gian hiện tại
    const remainingHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return {
      createdDate: dayjs(createdDate).format("DD/MM/YYYY"),
      remaining: `${localStrings?.GLobals?.Remain} ${remainingHours}h`,
    };
  }
};
