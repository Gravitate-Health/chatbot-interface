import { Axios, AxiosRequestConfig, AxiosResponse } from 'axios';
import AxiosController from '../utils/axios';
import { Logger } from '../utils/Logger';


export class ChatbotProvider extends AxiosController {
    constructor(baseUrl: string) {
        super(baseUrl);
    }
    
    chat = async (message: string, epiId: string, patientIdentifier?: string): Promise<AxiosResponse> => {
        try {
            let url = `${this.baseUrl}/chat/${epiId}?patientIdentifier=${patientIdentifier}`;
            console.log(url)
            return await this.request.post(url,{"question": message}, {headers: {"Content-Type": "application/json"}});
        } catch (error) {
            Logger.logError('ChatbotProvider.ts', "chat", 'Error chatting with chatbot. Error: ' + error);
            throw error;
        }
    }
}