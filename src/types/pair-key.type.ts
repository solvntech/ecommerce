export type PairKey = {
    publicKey: string;
    privateKey: string;
};

export type PairSecretToken = {
    accessToken: string;
    refreshToken: string;
};

export type TToken = PairKey & {
    user: string;
    refreshToken: string[];
};
