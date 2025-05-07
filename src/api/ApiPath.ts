export const ApiPath = {
  // Auth
  LOGIN_BY_OTP: getApiPath("auth/login-by-otp"),
  REGISTER:  getApiPath("auth/register"),
  LOGIN_FACEBOOK: getApiPath("auth/login-by-facebook"),

  //Profile
  GET_PROFILE: getApiPath("auth/user"),
  UPDATE_PROFILE: getApiPath("auth/update"),

  //Topic
  GET_TOPICS: getApiPath("topic/list"),

  // Card
  GET_RANDOM_CARDS: getApiPath("card/random"),

  // Chat History
  GET_CHAT_LIST: getApiPath("chat/list"),
  CREATE_CHAT: getApiPath("chat/create"),
  DELETE_CHAT: getApiPath("chat/delete"),
  UPDATE_CARDS: getApiPath("chat/update-cards"),

  // Chat messages
  CHAT: getApiPath("chat/detail"),

  //Horoscope
  GET_HOROSCOPE: getApiPath("horoscope/user"),
  GET_HOROSCOPE_DETAIL: getApiPath("horoscope/daily"),

  //Topup
  GET_PACKAGE_LIST: getApiPath("package/list"),
  CREATE_BILL: getApiPath("bill/create"),
  PAYED_RESULT: getApiPath("bill/success"),

  //Transaction History
  TRANSACTION_HISTORY: getApiPath("bill/list"),

  //Notification
  NOTIFICATION: getApiPath("notification/list"),

  //Post
  GET_POSTS: getApiPath("post/list"),
};

function getApiPath(path: string) {
  return `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT!}/api/v1/${path}`;
}
