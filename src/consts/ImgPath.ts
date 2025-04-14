const genAssetsLink = (link: string) => {
  return `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/card/${link}`;
}

export const LOGIN_BACKGROUND_VIDEO = genAssetsLink("background.mp4");
export const AVARTAR_IMAGE = genAssetsLink("avatar.png")
export const CARD_BACKGROUND = genAssetsLink("card-background.jpg")
export const MOMO_IMAGE = genAssetsLink("assets/momo.png")
export const BANNER_HOMEPAGE = genAssetsLink("assets/banner.png")
export const BANNER_HOROSCOPE = genAssetsLink("assets/horoscope-background.jpg")
export const BANNER_CARDS = genAssetsLink("assets/card-background.jpg")