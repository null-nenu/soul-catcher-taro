import { useState } from "react";
import { createModel } from "hox";

function useApp() {
    // status of user login
    const [canI, setCanI] = useState(false);
    // status of nick name
    const [nickName, setNickName] = useState(undefined as string | undefined);
    // status of avatar
    const [avatar, setAvatar] = useState(undefined as string | undefined);
    // background image
    const [background, setBackground] = useState(undefined as string | undefined);
    // music
    const [music, setMusic] = useState(undefined as string | undefined);
    // solgan
    const [solgan, setSolgan] = useState("你从来都不是一座孤岛");
    // mute
    const [mute, setMute] = useState(false);

    /**
     * 
     */
    function logout() {
        try {
            setCanI(false);
            setNickName(undefined);
            setAvatar(undefined);
            Taro.removeStorageSync("token");
        } catch (error) {
            // do nothing
        }
    }

    return {
        canI, setCanI,
        nickName, setNickName,
        avatar, setAvatar, logout,
        background, setBackground,
        music, setMusic,
        solgan, setSolgan,
        mute, setMute
    };
}

export default createModel(useApp);
