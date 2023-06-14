// "JEPQ" | "DSMD"
export type ScaleName = "MACI" | "MCMI" | "TCI" | "MPQ" | "EPQ" | "JTCI" | "EPQ-R" | "MMPI-RF" | "SCL-90R"

export type ScaleType = "binary" | "pentanary"

export enum ScaleNameToDBScaleName {
  "MACI" = "MACI",
  "MCMI" = "MCMI",
  "MMPI-RF" = "MMPI_RF",
  "TCI" = "TCI",
  "MPQ" = "MPQ",
  "EPQ" = "EPQ",
  "EPQ-R" = "EPQ_R",
  "JTCI" = "JTCI",
  // "JEPQ" = "JEPQ",
  // "DSMD" = "DSMD",
  "SCL-90R" = "SCL_90R"
}

export enum DBScaleNameToScaleName {
  "MACI" = "MACI",
  "MCMI" = "MCMI",
  "MMPI_RF" = "MMPI-RF",
  "TCI" = "TCI",
  "MPQ" = "MPQ",
  "EPQ" = "EPQ",
  "EPQ_R" = "EPQ-R",
  "JTCI" = "JTCI",
  // "JEPQ" = "JEPQ",
  // "DSMD" = "DSMD",
  "SCL_90R" = "SCL-90R"
}

export interface Scale {
  name: ScaleName;
  type: ScaleType;
  count: number;
  monthlyPrice: number;
  subScales: string[];
  expiresAt: string;
  updatedAt: string;
}

export type PurchaseStatus = 'pending' | 'success' | 'failed'


export interface SubscribedScale {
  name: ScaleName;
  type: ScaleType;
  count: number;
  monthlyPrice: number;
  subScales: string[];
  expiresAt: string | null;
  updatedAt: string;
}
/* MISC */
export interface JWTToken {
  id: string,
  ita: number,
  exp: number
}

export interface AuthResponse {
  isRegistered: boolean,
  token: {
    auth: string
  } | {
    access: string,
    refresh: string
  },
  user: {
    name: string,
    email: string,
  } | {
    phone: string,
  }
}
