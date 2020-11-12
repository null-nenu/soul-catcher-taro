import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import useAppModel from "@/models/appModel";

export const host: string = "https://soul.laoyoumoyan.com";

export default async function request(params: Taro.request.Option<any>) {
    let header = params?.header || {} as any;

    try {
        let token = Taro.getStorageSync('token');
        if (0 === token?.length) {
            throw ("can't get the token");
        }
        header = { ...header, Authorization: `Token ${token}` }
    } catch (error) {
        // do noting
    }

    params.header = header;

    let res = await Taro.request({ ...params, url: `${host}${params.url}` });
    switch (res.statusCode) {
        case 200:
            return res.data;
        case 401:
            try {
                Taro.removeStorageSync("token");
                Taro.atMessage({ message: "登录失效, 请重新登录。", type: "error" });
                setTimeout(function () {
                    Taro.navigateTo({ url: "/pages/login/index?logout=true" });
                }, 1000);
            } catch (error) {
                // do nothing
            }
            throw ("Unauthorized");
        default:
            throw (res.errMsg);
    }
}