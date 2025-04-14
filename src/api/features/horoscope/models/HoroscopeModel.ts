export interface HoroscopeRequestModel {
  language?: string,
  date?: string
}

export interface HoroscopeResponseModel {
  luckyColor?: {
    name?: string,
    code?: string
  },
  _id?: string,
  userId?: string,
  date?: string,
  zodiac?: string,
  icon?: string,
  summary?: string,
  love?: string,
  career?: string,
  finance?: string,
  health?: string,
  luckyNumber?: number,
  createdAt?: string,
  updatedAt?: string,
}