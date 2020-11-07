import { useState } from "react";
import { createModel } from "hox";

function useApp() {
    // status of user login
    const [canI, setCanI] = useState(false);
    // status of nick name
    const [nickName, setNickName] = useState("");
    // status of avatar
    const [avatar, setAvatar] = useState("");

    return {
        canI,
        setCanI,
        nickName,
        setNickName,
        avatar,
        setAvatar
    };
}

export default createModel(useApp);
