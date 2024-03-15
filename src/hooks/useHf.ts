// import { client, SpaceStatus } from "@gradio/client";
import { whoAmI } from "@huggingface/hub";
import { useEffect, useState } from "react"
// import { getSpaceId } from "../helpers/hf";

export const useHfClient = (inputAccessToken: string, spaceId: string, onLoading: (isLoading: boolean) => void, onErrorCallback: (msg: string) => void) => {
    // const [hfClient, setHfClient] = useState<any>(null);
    const [hfToken, setHfToken] = useState('');
    const [hfUserInfo, setHfUserInfo] = useState<{name: string, id: string}>({name: '', id: ''})
    

    const checkUserAccessToken = async () => {
        try {
            onLoading(true);
          const user = await whoAmI({
            credentials: { accessToken: inputAccessToken },
          });
          const _userName = user.name;
          const _userId = user.id;
    
          window.localStorage.setItem("HF_AT", inputAccessToken);
          
          setHfToken(inputAccessToken);
          setHfUserInfo({name: _userName === 'alexnusic' ? 'nusic' : _userName , id: _userId})
          // setUserName(_userName.endsWith("nusic") ? "nusic" : _userName); // user.name "nusic"
        } catch (e) {
            onErrorCallback("Invalid Access Token");
        } finally {
            onLoading(false);
        }
      };

    // const _setupClient = async () => {
    //     if (hfToken && hfUserInfo?.name && spaceId) {
    //         debugger
    //         const _client = await client(getSpaceId(hfUserInfo.name, spaceId), {
    //             hf_token: hfToken as `hf_${string}`,
    //             status_callback: (space_status: SpaceStatus) => {console.log(space_status); debugger}
    //           });
    //           setHfClient(_client)
    //     }
    // }
    // useEffect(() => {
    //     _setupClient()
    // }, [hfToken, spaceId])

    useEffect(() => {
        if (inputAccessToken) {
            checkUserAccessToken()
        }
    }, [inputAccessToken])

    return { hfToken, hfUserInfo }
}