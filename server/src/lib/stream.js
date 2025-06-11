import  {StreamChat} from "stream-chat"
import "dotenv/config"

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;
console.log(apiKey,apiSecret);

if(!apiKey || !apiSecret){
    console.error("stream api key or secret is misssing");
    
}

const streamClient = StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userData) =>{
    try {
        await streamClient.upsertUsers([userData])
    } catch (error) {
        console.error("error upserting stream user",error);
    };
}

//todo do it later
export const  generateStreamToken = (userId) =>{};
 