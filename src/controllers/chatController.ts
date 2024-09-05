import { Response, Request } from "express";
import { HttpStatusCode } from "axios";
import { Logger } from "../utils/Logger";
import {FhirProvider} from "../providers/fhir.provider";
import {ChatbotProvider} from "../providers/chatbot.provider";
import * as dotenv from "dotenv";
dotenv.config();

const FHIR_IPS_URL = process.env.FHIR_IPS_URL as string;
const FHIR_EPI_URL = process.env.FHIR_EPI_URL as string;
const CHATBOT_URL = process.env.CHATBOT_URL as string;

let fhirEpiProvider = new FhirProvider(FHIR_EPI_URL);
//let fhirIpsProvider = new FhirProvider(FHIR_IPS_URL);
let chatbotProvider = new ChatbotProvider(CHATBOT_URL);

export const chat = async (req: Request, res: Response) => {
    Logger.logInfo("chatController.ts", "chat", "\n\n\n_____________ CHAT INVOKED ____________")
    Logger.logDebug("chatController.ts", "chat", "FHIR_IPS_URL: " + FHIR_IPS_URL)
    Logger.logDebug("chatController.ts", "chat", "FHIR_EPI_URL: " + FHIR_EPI_URL)
    Logger.logDebug("chatController.ts", "chat", "CHATBOT_URL: " + CHATBOT_URL)

    // Get params
    let epiIdentifier: string, patientIdentifier: string
    epiIdentifier = req.query.epiIdentifier as string
    patientIdentifier = req.query.patientIdentifier as string


    if (!epiIdentifier || epiIdentifier === "") {
        res.status(HttpStatusCode.BadRequest).send({message: "Missing epiIdentifier parameter"})
        return;
    }
    if (!patientIdentifier || patientIdentifier === "") {
        res.status(HttpStatusCode.BadRequest).send({message: "Missing patientIdentifier parameter"})
        return;
    }
    // Query FHIR for ePI and IPS
    let epi: any, ips: any
    try {
        epi = await fhirEpiProvider.getResourceByIdentifier("Bundle", epiIdentifier)
        //console.log(epi.data)
        epi = epi.data["entry"][0]["resource"]
    } catch (error) {
        Logger.logError("chatController.ts", "chat", "Error querying FHIR: " + error)
        res.status(HttpStatusCode.InternalServerError).send({message: "Error querying FHIR"})
        return
    }

    Logger.logDebug("chatController.ts", "chat", "ePI: " + epi["id"])

    // Query chatbot
    let chatbotResponse
    try {
        chatbotResponse = await chatbotProvider.chat(req.body.question, epi["id"], patientIdentifier)
    } catch (error) {
        Logger.logError("chatController.ts", "chat", "Error querying chatbot: " + error)
        res.status(HttpStatusCode.InternalServerError).send({message: "Error querying chatbot"})
        return
    }

    res.status(HttpStatusCode.Ok).send(chatbotResponse.data)
    return
}
