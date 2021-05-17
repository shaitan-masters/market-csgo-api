declare module 'market-csgo-api' {
    import { Options, GotReturn } from 'got';
    import Bottleneck from 'bottleneck';

    namespace MarketCSGO {
        export interface ApiOptions {
            apiKey: string;
            baseUrl?: string; // Default: https://market.csgo.com/
            apiPath?: string; // Default: api
            extendedError?: boolean; // Default: false
            useLimiter?: boolean; // Default: true,
            Options?: Options; // Default: {}
            defaultOptions?: Options; // Default: {}
            limiterOptions?: Bottleneck.ConstructorOptions; // Defaults: { maxConcurrent: 1, minTime: 200, highWater: -1, strategy: Bottleneck.strategy.LEAK, rejectOnDrop: true }
        }

        export enum LANGUAGES {
            EN = 'en',
            RU = 'ru',
        }

        export enum CREATE_TRADE_REQUEST_TYPE {
            IN = 'in',
            OUT = 'out',
        }

        export enum MASS_INFO_SELL_BUY {
            NOTHING = 0,
            TOP_50_SUGGESTIONS = 1,
            TOP_SUGGESTION = 2,
        }

        export enum MASS_INFO_HISTORY {
            NOTHING = 0,
            LAST_100_SELLS = 1,
            LAST_10_SELLS = 2,
        }

        export enum MASS_INFO_INFO {
            NOTHING = 0,
            BASE = 1,
            EXTENDED = 2,
            MAXIMUM = 3,
        }

        export interface DEFAULT_MASS_INFO_PARAMS {
            sell: MASS_INFO_SELL_BUY.NOTHING;
            buy: MASS_INFO_SELL_BUY.NOTHING;
            history: MASS_INFO_HISTORY.NOTHING;
            info: MASS_INFO_INFO.BASE;
        }

        export interface ItemDataAsString {
            classId: string;
            instanceId: string;
        }

        export interface ItemDataAsNumber {
            classId: number;
            instanceId: number;
        }

        export interface PartnerData {
            partnerId: string;
            tradeToken: string;
        }

        export interface ItemDataWithMarketHashName {
            market_hash_name: string;
            [key: string]: any;
        }
    }

    export default class MarketCsgoApi {
        constructor(options: MarketCSGO.ApiOptions);

        public readonly options: Required<MarketCSGO.ApiOptions>;
        public readonly apiUrl: string;

        public static readonly defaultAppId: number;
        public static readonly defaultBaseUrl: string;
        public static readonly LANGUAGES: MarketCSGO.LANGUAGES;
        public static readonly CREATE_TRADE_REQUEST_TYPE: MarketCSGO.CREATE_TRADE_REQUEST_TYPE;
        public static readonly MASS_INFO_SELL_BUY: MarketCSGO.MASS_INFO_SELL_BUY;
        public static readonly MASS_INFO_HISTORY: MarketCSGO.MASS_INFO_HISTORY;
        public static readonly MASS_INFO_INFO: MarketCSGO.MASS_INFO_INFO;
        public static readonly DEFAULT_MASS_INFO_PARAMS: MarketCSGO.DEFAULT_MASS_INFO_PARAMS;

        public static requestJSON(url: string): GotReturn;
        public static requestJSON(
            url: string,
            Options: Partial<Options>
        ): GotReturn;

        public static formatApiCall(params: string): string;
        public static formatApiCall(
            params: string,
            disableProcessing: boolean
        ): string;
        public static formatApiCall(params: Array<string>): string;
        public static formatApiCall(
            params: Array<string>,
            disableProcessing: boolean
        ): string;

        public static formatPrice(cents: string): string;
        public static formatPrice(cents: number): string;

        public static getItemIds(item: object): MarketCSGO.ItemDataAsString;
        public static getItemIds(
            item: object,
            asNumbers: false
        ): MarketCSGO.ItemDataAsString;
        public static getItemIds(
            item: object,
            asNumbers: true
        ): MarketCSGO.ItemDataAsNumber;

        public static getItemHash(item: object): string;

        public static formatItem(item: object): string;
        public static formatItem(item: object, symbol: string): string;

        public limitRequest(callback: () => void): Promise<void>;

        public callMethodWithKey(method: string): Promise<void>;
        public callMethodWithKey(method: Array<string>): Promise<void>;
        public callMethodWithKey(
            method: string,
            Options: Partial<Options>
        ): Promise<void>;
        public callMethodWithKey(
            method: Array<string>,
            Options: Partial<Options>
        ): Promise<void>;
        public callMethodWithKey(
            method: string,
            Options: Partial<Options>,
            params: object
        ): Promise<void>;
        public callMethodWithKey(
            method: Array<string>,
            Options: Partial<Options>,
            params: object
        ): Promise<void>;

        public formatMethodWithKey(method: string): string;
        public formatMethodWithKey(method: string, params: object): string;
        public formatMethodWithKey(method: Array<string>): string;
        public formatMethodWithKey(
            method: Array<string>,
            params: object
        ): string;

        public requestJsonHook(url: string): GotReturn;
        public requestJsonHook(
            url: string,
            Options: Partial<Options>
        ): GotReturn;

        public requestHook(url: string): GotReturn;
        public requestHook(url: string, Options: Partial<Options>): GotReturn;

        public callApiUrl(url: string): GotReturn;
        public callApiUrl(url: string, Options: Partial<Options>): GotReturn;

        public callPostMethodWithKey(method: string): GotReturn;
        public callPostMethodWithKey(method: Array<string>): GotReturn;
        public callPostMethodWithKey(
            method: string,
            postData: object
        ): GotReturn;
        public callPostMethodWithKey(
            method: Array<string>,
            postData: object
        ): GotReturn;
        public callPostMethodWithKey(
            method: string,
            postData: object,
            Options: Partial<Options>
        ): GotReturn;
        public callPostMethodWithKey(
            method: Array<string>,
            postData: object,
            Options: Partial<Options>
        ): GotReturn;
        public callPostMethodWithKey(
            method: string,
            postData: object,
            Options: Partial<Options>,
            params: object
        ): GotReturn;
        public callPostMethodWithKey(
            method: Array<string>,
            postData: object,
            Options: Partial<Options>,
            params: object
        ): GotReturn;

        public makeOptions(opts: Partial<Options>): Options;

        public callItemMethod(item: object, method: string): GotReturn;
        public callItemMethod(
            item: object,
            method: string,
            Options: Options
        ): GotReturn;

        public callItemMethod(item: object, method: string): GotReturn;
        public callItemMethod(
            item: object,
            method: string,
            Options: Options
        ): GotReturn;

        public dbName(): GotReturn;
        public dbName(appId: number): GotReturn;
        public dbName(appId: number, baseUrl: string): GotReturn;
        public dbName(
            appId: number,
            baseUrl: string,
            Options: Partial<Options>
        ): GotReturn;

        public itemDb(dbName: string): GotReturn;
        public itemDb(dbName: string, baseUrl: string): GotReturn;
        public itemDb(
            dbName: string,
            baseUrl: string,
            Options: Partial<Options>
        ): GotReturn;

        public currentItemDb(): GotReturn;
        public currentItemDb(appId: number): GotReturn;
        public currentItemDb(appId: number, baseUrl: string): GotReturn;
        public currentItemDb(
            appId: number,
            baseUrl: string,
            Options: Partial<Options>
        ): GotReturn;

        public history(): GotReturn;
        public history(baseUrl: string): GotReturn;
        public history(baseUrl: string, Options: Partial<Options>): GotReturn;

        public accountGetSteamInventory(): GotReturn;
        public accountGetSteamInventory(Options: Partial<Options>): GotReturn;

        public accountGetTrades(): GotReturn;
        public accountGetTrades(Options: Partial<Options>): GotReturn;

        public accountGetMoney(): GotReturn;
        public accountGetMoney(Options: Partial<Options>): GotReturn;

        public accountPingPong(): GotReturn;
        public accountPingPong(Options: Partial<Options>): GotReturn;

        public accountGoOffline(): GotReturn;
        public accountGoOffline(Options: Partial<Options>): GotReturn;

        public accountSetToken(token: string): GotReturn;
        public accountSetToken(
            token: string,
            Options: Partial<Options>
        ): GotReturn;

        public accountGetToken(): GotReturn;
        public accountGetToken(Options: Partial<Options>): GotReturn;

        public accountGetWSAuth(): GotReturn;
        public accountGetWSAuth(Options: Partial<Options>): GotReturn;

        public accountUpdateInventory(): GotReturn;
        public accountUpdateInventory(Options: Partial<Options>): GotReturn;

        public accountGetCacheInfoInventory(): GotReturn;
        public accountGetCacheInfoInventory(
            Options: Partial<Options>
        ): GotReturn;

        public accountGetOperationHistory(from: Date, to: Date): GotReturn;
        public accountGetOperationHistory(
            from: Date,
            to: Date,
            Options: Partial<Options>
        ): GotReturn;

        public accountGetDiscounts(): GotReturn;
        public accountGetDiscounts(Options: Partial<Options>): GotReturn;

        public accountGetCounters(): GotReturn;
        public accountGetCounters(Options: Partial<Options>): GotReturn;

        public accountGetProfileItems(hash: string): GotReturn;
        public accountGetProfileItems(
            hash: string,
            Options: Partial<Options>
        ): GotReturn;

        public accountGetCounters(): GotReturn;
        public accountGetCounters(Options: Partial<Options>): GotReturn;

        public accountGetItemsSellOffers(): GotReturn;
        public accountGetItemsSellOffers(Options: Partial<Options>): GotReturn;

        public accountGetItemsToGive(): GotReturn;
        public accountGetItemsToGive(Options: Partial<Options>): GotReturn;

        public itemGetInfo(item: object): GotReturn;
        public itemGetInfo(
            item: object,
            language: MarketCSGO.LANGUAGES
        ): GotReturn;
        public itemGetInfo(
            item: object,
            language: MarketCSGO.LANGUAGES,
            Options: Partial<Options>
        ): GotReturn;

        public itemGetHistory(item: object): GotReturn;
        public itemGetHistory(
            item: object,
            Options: Partial<Options>
        ): GotReturn;

        public itemGetFloatHash(item: object): GotReturn;
        public itemGetFloatHash(
            item: object,
            Options: Partial<Options>
        ): GotReturn;

        public itemGetSellOffers(item: object): GotReturn;
        public itemGetSellOffers(
            item: object,
            Options: Partial<Options>
        ): GotReturn;

        public itemGetBestSellOffer(item: object): GotReturn;
        public itemGetBestSellOffer(
            item: object,
            Options: Partial<Options>
        ): GotReturn;

        public itemGetBuyOffers(item: object): GotReturn;
        public itemGetBuyOffers(
            item: object,
            Options: Partial<Options>
        ): GotReturn;

        public itemGetBestBuyOffer(item: object): GotReturn;
        public itemGetBestBuyOffer(
            item: object,
            Options: Partial<Options>
        ): GotReturn;

        public itemGetDescription(item: object): GotReturn;
        public itemGetDescription(
            item: object,
            Options: Partial<Options>
        ): GotReturn;

        public itemMassInfo(item: object): GotReturn;
        public itemMassInfo(item: object, params: object): GotReturn;
        public itemMassInfo(
            item: object,
            params: object,
            Options: Partial<Options>
        ): GotReturn;
        public itemMassInfo(items: Array<object>): GotReturn;
        public itemMassInfo(items: Array<object>, params: object): GotReturn;
        public itemMassInfo(
            items: Array<object>,
            params: object,
            Options: Partial<Options>
        ): GotReturn;

        public sellCreate(item: object, price: number): GotReturn;
        public sellCreate(
            item: object,
            price: number,
            Options: Partial<Options>
        ): GotReturn;

        public sellCreateAsset(assetId: object, price: number): GotReturn;
        public sellCreateAsset(
            assetId: object,
            price: number,
            Options: Partial<Options>
        ): GotReturn;

        public sellUpdatePrice(itemId: string, price: number): GotReturn;
        public sellUpdatePrice(
            itemId: string,
            price: number,
            Options: Partial<Options>
        ): GotReturn;

        public sellRemove(itemId: string): GotReturn;
        public sellRemove(itemId: string, Options: Partial<Options>): GotReturn;

        public sellCreateTradeRequest(botId: string): GotReturn;
        public sellCreateTradeRequest(
            botId: string,
            type: MarketCSGO.CREATE_TRADE_REQUEST_TYPE
        ): GotReturn;
        public sellCreateTradeRequest(
            botId: string,
            type: MarketCSGO.CREATE_TRADE_REQUEST_TYPE,
            Options: Partial<Options>
        ): GotReturn;

        public sellGetMarketTrades(): GotReturn;
        public sellGetMarketTrades(Options: Partial<Options>): GotReturn;

        public sellMassUpdatePrice(item: object, price: number): GotReturn;
        public sellMassUpdatePrice(
            item: object,
            price: number,
            Options: Partial<Options>
        ): GotReturn;

        public sellMassUpdatePriceById(prices: {
            [ui_id: string]: number;
        }): GotReturn;
        public sellMassUpdatePriceById(
            prices: { [ui_id: string]: number },
            Options: Partial<Options>
        ): GotReturn;

        public sellMassUpdatePriceById(prices: {
            [ui_id: string]: number;
        }): GotReturn;
        public sellMassUpdatePriceById(
            prices: { [ui_id: string]: number },
            Options: Partial<Options>
        ): GotReturn;

        public buyCreate(item: object, price: number): GotReturn;
        public buyCreate(
            item: object,
            price: number,
            tradeData: MarketCSGO.PartnerData
        ): GotReturn;
        public buyCreate(
            item: object,
            price: number,
            tradeData: MarketCSGO.PartnerData,
            Options: Partial<Options>
        ): GotReturn;

        public orderGetList(): GotReturn;
        public orderGetList(page: number): GotReturn;
        public orderGetList(page: number, Options: Partial<Options>): GotReturn;

        public orderCreate(item: object, price: number): GotReturn;
        public orderCreate(
            item: object,
            price: number,
            Options: Partial<Options>
        ): GotReturn;

        public orderUpdateOrRemove(item: object, price: number): GotReturn;
        public orderUpdateOrRemove(
            item: object,
            price: number,
            Options: Partial<Options>
        ): GotReturn;

        public orderProcess(item: object, price: number): GotReturn;
        public orderProcess(
            item: object,
            price: number,
            Options: Partial<Options>
        ): GotReturn;

        public orderDeleteAll(): GotReturn;
        public orderDeleteAll(Options: Partial<Options>): GotReturn;

        public orderSystemStatus(): GotReturn;
        public orderSystemStatus(Options: Partial<Options>): GotReturn;

        public orderGetLog(): GotReturn;
        public orderGetLog(Options: Partial<Options>): GotReturn;

        public notificationGet(): GotReturn;
        public notificationGet(Options: Partial<Options>): GotReturn;

        public notificationProcess(item: object, price: number): GotReturn;
        public notificationProcess(
            item: object,
            price: number,
            Options: Partial<Options>
        ): GotReturn;

        public searchItemsByName(item: object): GotReturn;
        public searchItemsByName(items: Array<object>): GotReturn;
        public searchItemsByName(
            item: object,
            Options: Partial<Options>
        ): GotReturn;
        public searchItemsByName(
            item: Array<object>,
            Options: Partial<Options>
        ): GotReturn;

        public searchItemByName(
            item: MarketCSGO.ItemDataWithMarketHashName
        ): GotReturn;
        public searchItemByName(
            items: Array<MarketCSGO.ItemDataWithMarketHashName>
        ): GotReturn;
        public searchItemByName(
            item: MarketCSGO.ItemDataWithMarketHashName,
            Options: Partial<Options>
        ): GotReturn;
        public searchItemByName(
            item: Array<MarketCSGO.ItemDataWithMarketHashName>,
            Options: Partial<Options>
        ): GotReturn;

        public quickGetItems(): GotReturn;
        public quickGetItems(Options: Partial<Options>): GotReturn;

        public quickGetItems(itemId: string): GotReturn;
        public quickGetItems(
            itemId: string,
            Options: Partial<Options>
        ): GotReturn;

        public additionalGetStickers(): GotReturn;
        public additionalGetStickers(Options: Partial<Options>): GotReturn;

        public additionalTest(): GotReturn;
        public additionalTest(Options: Partial<Options>): GotReturn;

        public additionalGetChatLog(): GotReturn;
        public additionalGetChatLog(Options: Partial<Options>): GotReturn;

        public additionalCheckBotStatus(botId: string): GotReturn;
        public additionalCheckBotStatus(
            botId: string,
            Options: Partial<Options>
        ): GotReturn;
    }
}
