declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string;
            BOT_PREFIX: string;
            MONGO_URL: string;
            DEVS: string;
        }
    }
}
export { };