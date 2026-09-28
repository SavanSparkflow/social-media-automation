import { Zernio } from "@zernio/node";

export const getZernioClient = (customKey?: string | null) => {
    return new Zernio({
        apiKey: (customKey || process.env.ZERNIO_API_KEY || "") as string,
        baseURL: "https://zernio.com/api"
    });
};

const zernio = getZernioClient();

export default zernio;