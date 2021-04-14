declare module 'market-csgo-api' {
  import {GotOptions, GotReturn} from "got";
  import Bottleneck from 'bottleneck';

  namespace MarketCSGO {
    export interface ApiOptions {
      apiKey: string,
      baseUrl?: string, // Default: https://market.csgo.com/
      apiPath?: string, // Default: api
      extendedError?: boolean, // Default: false
      useLimiter?: boolean, // Default: true,
      gotOptions?: GotOptions, // Default: {}
      defaultGotOptions?: GotOptions, // Default: {}
      limiterOptions?: Bottleneck.ConstructorOptions // Defaults: { maxConcurrent: 1, minTime: 200, highWater: -1, strategy: Bottleneck.strategy.LEAK, rejectOnDrop: true }
    }

    export enum LANGUAGES {
      EN = 'en',
      RU = 'ru'
    }

    export enum CREATE_TRADE_REQUEST_TYPE {
      IN = 'in',
      OUT = 'out'
    }

    export enum MASS_INFO_SELL_BUY {
      NOTHING = 0,
      TOP_50_SUGGESTIONS = 1,
      TOP_SUGGESTION = 2
    }

    export enum MASS_INFO_HISTORY {
      NOTHING = 0,
      LAST_100_SELLS = 1,
      LAST_10_SELLS = 2
    }

    export enum MASS_INFO_INFO {
      NOTHING = 0,
      BASE = 1,
      EXTENDED = 2,
      MAXIMUM = 3
    }

    export interface DEFAULT_MASS_INFO_PARAMS {
      sell: MASS_INFO_SELL_BUY.NOTHING,
      buy: MASS_INFO_SELL_BUY.NOTHING,
      history: MASS_INFO_HISTORY.NOTHING,
      info: MASS_INFO_INFO.BASE
    }

    export interface ItemDataAsString {
      classId: string,
      instanceId: string
    }

    export interface ItemDataAsNumber {
      classId: number,
      instanceId: number
    }

    export interface PartnerData {
      partnerId: string,
      tradeToken: string
    }

    export interface ItemDataWithMarketHashName {
      market_hash_name: string,
      [key: string]: any
    }
  }

  export default class MarketCsgoApi {
    constructor( options: MarketCSGO.ApiOptions );

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
    public static requestJSON(url: string, gotOptions: Partial<GotOptions>): GotReturn;

    public static formatApiCall(params: string): string;
    public static formatApiCall(params: string, disableProcessing: boolean): string;
    public static formatApiCall(params: Array<string>): string;
    public static formatApiCall(params: Array<string>, disableProcessing: boolean): string;

    public static formatPrice(cents: string): string;
    public static formatPrice(cents: number): string;

    public static getItemIds(item: object): MarketCSGO.ItemDataAsString;
    public static getItemIds(item: object, asNumbers: false): MarketCSGO.ItemDataAsString;
    public static getItemIds(item: object, asNumbers: true): MarketCSGO.ItemDataAsNumber;

    public static getItemHash(item: object): string;

    public static formatItem(item: object): string;
    public static formatItem(item: object, symbol: string): string;

    public limitRequest(callback: () => void): Promise<void>;

    public callMethodWithKey(method: string): Promise<void>;
    public callMethodWithKey(method: Array<string>): Promise<void>;
    public callMethodWithKey(method: string, gotOptions: Partial<GotOptions>): Promise<void>;
    public callMethodWithKey(method: Array<string>, gotOptions: Partial<GotOptions>): Promise<void>;
    public callMethodWithKey(method: string, gotOptions: Partial<GotOptions>, params: object): Promise<void>;
    public callMethodWithKey(method: Array<string>, gotOptions: Partial<GotOptions>, params: object): Promise<void>;

    public formatMethodWithKey(method: string): string;
    public formatMethodWithKey(method: string, params: object): string;
    public formatMethodWithKey(method: Array<string>): string;
    public formatMethodWithKey(method: Array<string>, params: object): string;

    public requestJsonHook(url: string): GotReturn;
    public requestJsonHook(url: string, gotOptions: Partial<GotOptions>): GotReturn;

    public requestHook(url: string): GotReturn;
    public requestHook(url: string, gotOptions: Partial<GotOptions>): GotReturn;

    public callApiUrl(url: string): GotReturn;
    public callApiUrl(url: string, gotOptions: Partial<GotOptions>): GotReturn;

    public callPostMethodWithKey(method: string): GotReturn;
    public callPostMethodWithKey(method: Array<string>): GotReturn;
    public callPostMethodWithKey(method: string, postData: object): GotReturn;
    public callPostMethodWithKey(method: Array<string>, postData: object): GotReturn;
    public callPostMethodWithKey(method: string, postData: object, gotOptions: Partial<GotOptions>): GotReturn;
    public callPostMethodWithKey(method: Array<string>, postData: object, gotOptions: Partial<GotOptions>): GotReturn;
    public callPostMethodWithKey(method: string, postData: object, gotOptions: Partial<GotOptions>, params: object): GotReturn;
    public callPostMethodWithKey(method: Array<string>, postData: object, gotOptions: Partial<GotOptions>, params: object): GotReturn;

    public makeGotOptions(opts: Partial<GotOptions>): GotOptions;

    public callItemMethod(item: object, method: string): GotReturn;
    public callItemMethod(item: object, method: string, gotOptions: GotOptions): GotReturn;


    public callItemMethod(item: object, method: string): GotReturn;
    public callItemMethod(item: object, method: string, gotOptions: GotOptions): GotReturn;

    public dbName(): GotReturn;
    public dbName(appId: number): GotReturn;
    public dbName(appId: number, baseUrl: string): GotReturn;
    public dbName(appId: number, baseUrl: string, gotOptions: Partial<GotOptions>): GotReturn;

    public itemDb(dbName: string): GotReturn;
    public itemDb(dbName: string, baseUrl: string): GotReturn;
    public itemDb(dbName: string, baseUrl: string, gotOptions: Partial<GotOptions>): GotReturn;

    public currentItemDb(): GotReturn;
    public currentItemDb(appId : number): GotReturn;
    public currentItemDb(appId : number, baseUrl: string): GotReturn;
    public currentItemDb(appId : number, baseUrl: string, gotOptions: Partial<GotOptions>): GotReturn;

    public history(): GotReturn;
    public history(baseUrl: string): GotReturn;
    public history(baseUrl: string, gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetSteamInventory(): GotReturn;
    public accountGetSteamInventory(gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetTrades(): GotReturn;
    public accountGetTrades(gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetMoney(): GotReturn;
    public accountGetMoney(gotOptions: Partial<GotOptions>): GotReturn;

    public accountPingPong(): GotReturn;
    public accountPingPong(gotOptions: Partial<GotOptions>): GotReturn;

    public accountGoOffline(): GotReturn;
    public accountGoOffline(gotOptions: Partial<GotOptions>): GotReturn;

    public accountSetToken(token: string): GotReturn;
    public accountSetToken(token: string, gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetToken(): GotReturn;
    public accountGetToken(gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetWSAuth(): GotReturn;
    public accountGetWSAuth(gotOptions: Partial<GotOptions>): GotReturn;

    public accountUpdateInventory(): GotReturn;
    public accountUpdateInventory(gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetCacheInfoInventory(): GotReturn;
    public accountGetCacheInfoInventory(gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetOperationHistory(from: Date, to: Date): GotReturn;
    public accountGetOperationHistory(from: Date, to: Date, gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetDiscounts(): GotReturn;
    public accountGetDiscounts(gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetCounters(): GotReturn;
    public accountGetCounters(gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetProfileItems(hash: string): GotReturn;
    public accountGetProfileItems(hash: string, gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetCounters(): GotReturn;
    public accountGetCounters(gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetItemsSellOffers(): GotReturn;
    public accountGetItemsSellOffers(gotOptions: Partial<GotOptions>): GotReturn;

    public accountGetItemsToGive(): GotReturn;
    public accountGetItemsToGive(gotOptions: Partial<GotOptions>): GotReturn;

    public itemGetInfo(item: object): GotReturn;
    public itemGetInfo(item: object, language: MarketCSGO.LANGUAGES): GotReturn;
    public itemGetInfo(item: object, language: MarketCSGO.LANGUAGES, gotOptions: Partial<GotOptions>): GotReturn;

    public itemGetHistory(item: object): GotReturn;
    public itemGetHistory(item: object, gotOptions: Partial<GotOptions>): GotReturn;

    public itemGetFloatHash(item: object): GotReturn;
    public itemGetFloatHash(item: object, gotOptions: Partial<GotOptions>): GotReturn;

    public itemGetSellOffers(item: object): GotReturn;
    public itemGetSellOffers(item: object, gotOptions: Partial<GotOptions>): GotReturn;

    public itemGetBestSellOffer(item: object): GotReturn;
    public itemGetBestSellOffer(item: object, gotOptions: Partial<GotOptions>): GotReturn;

    public itemGetBuyOffers(item: object): GotReturn;
    public itemGetBuyOffers(item: object, gotOptions: Partial<GotOptions>): GotReturn;

    public itemGetBestBuyOffer(item: object): GotReturn;
    public itemGetBestBuyOffer(item: object, gotOptions: Partial<GotOptions>): GotReturn;

    public itemGetDescription(item: object): GotReturn;
    public itemGetDescription(item: object, gotOptions: Partial<GotOptions>): GotReturn;

    public itemMassInfo(item: object): GotReturn;
    public itemMassInfo(item: object, params: object): GotReturn;
    public itemMassInfo(item: object, params: object, gotOptions: Partial<GotOptions>): GotReturn;
    public itemMassInfo(items: Array<object>): GotReturn;
    public itemMassInfo(items: Array<object>, params: object): GotReturn;
    public itemMassInfo(items: Array<object>, params: object, gotOptions: Partial<GotOptions>): GotReturn;

    public sellCreate(item: object, price: number): GotReturn;
    public sellCreate(item: object, price: number, gotOptions: Partial<GotOptions>): GotReturn;

    public sellCreateAsset(assetId: object, price: number): GotReturn;
    public sellCreateAsset(assetId: object, price: number, gotOptions: Partial<GotOptions>): GotReturn;

    public sellUpdatePrice(itemId: string, price: number): GotReturn;
    public sellUpdatePrice(itemId: string, price: number, gotOptions: Partial<GotOptions>): GotReturn;

    public sellRemove(itemId: string): GotReturn;
    public sellRemove(itemId: string, gotOptions: Partial<GotOptions>): GotReturn;

    public sellCreateTradeRequest(botId: string): GotReturn;
    public sellCreateTradeRequest(botId: string, type: MarketCSGO.CREATE_TRADE_REQUEST_TYPE): GotReturn;
    public sellCreateTradeRequest(botId: string, type: MarketCSGO.CREATE_TRADE_REQUEST_TYPE, gotOptions: Partial<GotOptions>): GotReturn;

    public sellGetMarketTrades(): GotReturn;
    public sellGetMarketTrades(gotOptions: Partial<GotOptions>): GotReturn;

    public sellMassUpdatePrice(item: object, price: number): GotReturn;
    public sellMassUpdatePrice(item: object, price: number, gotOptions: Partial<GotOptions>): GotReturn;

    public sellMassUpdatePriceById(prices: {[ui_id:string] : number}): GotReturn;
    public sellMassUpdatePriceById(prices: {[ui_id:string] : number}, gotOptions: Partial<GotOptions>): GotReturn;

    public sellMassUpdatePriceById(prices: {[ui_id:string] : number}): GotReturn;
    public sellMassUpdatePriceById(prices: {[ui_id:string] : number}, gotOptions: Partial<GotOptions>): GotReturn;

    public buyCreate(item: object, price: number): GotReturn;
    public buyCreate(item: object, price: number, tradeData: MarketCSGO.PartnerData): GotReturn;
    public buyCreate(item: object, price: number, tradeData: MarketCSGO.PartnerData, gotOptions: Partial<GotOptions>): GotReturn;

    public orderGetList(): GotReturn;
    public orderGetList(page: number): GotReturn;
    public orderGetList(page: number, gotOptions: Partial<GotOptions>): GotReturn;

    public orderCreate(item: object, price: number): GotReturn;
    public orderCreate(item: object, price: number, gotOptions: Partial<GotOptions>): GotReturn;

    public orderUpdateOrRemove(item: object, price: number): GotReturn;
    public orderUpdateOrRemove(item: object, price: number, gotOptions: Partial<GotOptions>): GotReturn;

    public orderProcess(item: object, price: number): GotReturn;
    public orderProcess(item: object, price: number, gotOptions: Partial<GotOptions>): GotReturn;

    public orderDeleteAll(): GotReturn;
    public orderDeleteAll(gotOptions: Partial<GotOptions>): GotReturn;

    public orderSystemStatus(): GotReturn;
    public orderSystemStatus(gotOptions: Partial<GotOptions>): GotReturn;

    public orderGetLog(): GotReturn;
    public orderGetLog(gotOptions: Partial<GotOptions>): GotReturn;

    public notificationGet(): GotReturn;
    public notificationGet(gotOptions: Partial<GotOptions>): GotReturn;

    public notificationProcess(item: object, price: number): GotReturn;
    public notificationProcess(item: object, price: number, gotOptions: Partial<GotOptions>): GotReturn;

    public searchItemsByName(item: object): GotReturn;
    public searchItemsByName(items: Array<object>): GotReturn;
    public searchItemsByName(item: object, gotOptions: Partial<GotOptions>): GotReturn;
    public searchItemsByName(item: Array<object>, gotOptions: Partial<GotOptions>): GotReturn;

    public searchItemByName(item: MarketCSGO.ItemDataWithMarketHashName): GotReturn;
    public searchItemByName(items: Array<MarketCSGO.ItemDataWithMarketHashName>): GotReturn;
    public searchItemByName(item: MarketCSGO.ItemDataWithMarketHashName, gotOptions: Partial<GotOptions>): GotReturn;
    public searchItemByName(item: Array<MarketCSGO.ItemDataWithMarketHashName>, gotOptions: Partial<GotOptions>): GotReturn;

    public quickGetItems(): GotReturn;
    public quickGetItems(gotOptions: Partial<GotOptions>): GotReturn;

    public quickGetItems(itemId: string): GotReturn;
    public quickGetItems(itemId: string, gotOptions: Partial<GotOptions>): GotReturn;

    public additionalGetStickers(): GotReturn;
    public additionalGetStickers(gotOptions: Partial<GotOptions>): GotReturn;

    public additionalTest(): GotReturn;
    public additionalTest(gotOptions: Partial<GotOptions>): GotReturn;

    public additionalGetChatLog(): GotReturn;
    public additionalGetChatLog(gotOptions: Partial<GotOptions>): GotReturn;

    public additionalCheckBotStatus(botId: string): GotReturn;
    public additionalCheckBotStatus(botId: string, gotOptions: Partial<GotOptions>): GotReturn;
  }
}
