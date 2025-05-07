import { NotificationRequestModel, NotificationResponseModel } from "@/api/features/notification/models/NotificationModel";
import { defaultNotificationRepo } from "@/api/features/notification/NotificationRepo";
import { useMessage } from "@/context/socket/useMessage"
import { useCallback, useEffect, useState } from "react";

const NotificationViewModel = () => {
  const { seenNotification, seenDoneTrigger } = useMessage();
  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<NotificationResponseModel[]>([]);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
  const [seenTrigger, setSeenTrigger] = useState(false);

  const getNotifications = async (query: NotificationRequestModel) => {
    try {
      const res = await defaultNotificationRepo.getNotifications(query);
      if (res.code === 200 && res.data) {
        setNotifications((prev) => {
          if (query?.page === 1) return res.data || [];
          const newNoti = res.data.filter(
            (noti) => !prev?.some((existingNoti) => existingNoti._id === noti._id)
          );
          return prev ? [...prev, ...newNoti] : res.data || [];
        });
        setHasMoreNotifications(res?.paging?.page < res?.paging?.totalPages);
      } else {
        setNotifications([]);
        setHasMoreNotifications(false);
        console.error("Error fetching notifications:", res?.message);
      }
    } catch (error) {
      setNotifications([]);
      console.error("Error fetching notifications:", error);
    }
  }

  const loadMoreNotifications = async () => {
    if (hasMoreNotifications) {
      setPage(page + 1);
    }
  };

  const seenNoti = (id?: string) => {
    seenNotification(id);
    setPage(1);
    setSeenTrigger((prev) => !prev);
  }

  useEffect(() => {
    getNotifications({ page: 1, limit: 8 });

    return () => {
      setPage(1);
    }
  }, [seenTrigger, seenDoneTrigger])

  useEffect(() => {
    page > 1 && getNotifications({ page, limit: 8 });
  }, [seenTrigger, page, seenDoneTrigger])

  return {
    notifications,
    loadMoreNotifications,
    seenNoti,
    hasMoreNotifications
  }
}

export default NotificationViewModel