import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import AxiosController from '../utils/axios';
import { Logger } from '../utils/Logger';


export class FhirProvider extends AxiosController {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    getResourceByIdentifier = async (resourceType: string, identifier: string): Promise<AxiosResponse> => {
        try {
            let url = `${this.baseUrl}/${resourceType}?identifier=${identifier}&_format=json`;
            Logger.logDebug("FhirProvider.ts", "getResourceByIdentifier", "URL: " + url)
            return await this.request.get(url);
        } catch (error) {
            Logger.logError('FhirProvider.ts', "getEpiById", 'Error getting epi by id. Error: ' + error);
            throw error;
        }
    }
}