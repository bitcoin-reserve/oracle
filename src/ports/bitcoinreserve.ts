import axios from 'axios';
import axiosThrottle from 'axios-request-throttle';
import { PriceSource } from '../domain/price-source';
import { Ticker } from '../domain/ticker';


axiosThrottle.use(axios, { requestsPerSecond: 5 });

type BitcoinReserveResponse = {
    BTC: {EUR: {buy:string;}};
};

function isBitcoinReserveResponse(obj: any): obj is BitcoinReserveResponse {
    return obj && typeof obj.last_price === 'string';
}

export class BitcoinReservePriceSource implements PriceSource {
    static URL = 'https://bitcoinreserve.com/api/price/';

    public async getPrice(ticker: Ticker): Promise<number> {

        const response = await axios.get<BitcoinReserveResponse>(
            `${BitcoinReservePriceSource.URL}`
        );
        console.log(response.data)
        console.log(response.data.BTC.EUR.buy)

        if (!isBitcoinReserveResponse(response.data)) {
            throw new Error(
                `Invalid response from ${BitcoinReservePriceSource.URL}`
            );
        }
        return Number(response.data.BTC.EUR.buy);
    }
}
