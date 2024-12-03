export enum SocialBrandingEnum {
  Zalo = 0,
  Facebook = 1,
  Shoppe = 2,
  TikTok = 3,
  Instagram = 4,
  Google = 5,
  Youtube = 6,
  //Twitter = 7,
  //Pinterest = 8,
  //Snapchat = 9,
  //LinkedIn = 10,
  //WhatsApp = 11,
  //WeChat = 12,
  //Line = 13,
  //Telegram = 14,
  //Viber = 15,
  //Skype = 16,
  //Zoom = 17,
  //Slack = 18,
  //Discord = 19,
  //Twitch = 20,
  Sendo = 21,
  Tiki = 22,
  Lazada = 23,
  Apple = 24,
}

export enum LabelBrandingPositionEnum {
  TopCenter = 1,
  TopLeft = 2,
  TopRight = 3,
  BottomCenter = 4,
  BottomLeft = 5,
  BottomRight = 6,
}

export enum LabelBrandingTypeEnum {
  DirectLink = 0,
  FirstTimeUser = 1,
  HelpCenter = 2,
  MyAccount = 3,
  PrivacyPolicy = 4,
  TermAndCondition = 5,
  AboutUs = 6,
}

export enum ReferralImageBrandEnum {
  Android = 0,
  IOS = 1,
}

export interface IBrandingSettings {
  socials?: ISocialBranding[] | null;
  labels?: ILabelBranding[] | null;
  supportName?: string | null;
  supportLink?: string | null;
  referralImages?: IReferralBranding[] | null;
  layoutColor?: ILayoutColorBranding | null;
  signature?: string | null;
}

export interface ISocialBranding {
  logo?: string | null;
  url: string;
  type: SocialBrandingEnum;
  name?: string | null;
}

export interface ILabelBranding {
  type: LabelBrandingTypeEnum;
  position: LabelBrandingPositionEnum;
  url: string;
  name: string;
  id?: number | null;
}

export interface ILayoutColorBranding {
  button: {
    fontColor: string;
    buttonColor: string;
  };
  header: {
    fontColor: string;
    textColor: string;
  };
}
export interface IReferralBranding {
  type: ReferralImageBrandEnum;
  image: string;
}

export interface IPreviewTemplateResponse {
  subject: string;
  content: string;
}
