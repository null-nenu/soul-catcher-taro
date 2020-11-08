import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";

export const host: string = "https://soul.laoyoumoyan.com";

export default async function request(params: Taro.request.Option<any>) {
    let res = await Taro.request({ ...params, url: `${host}${params.url}` });
    if (res.statusCode === 200) {
        return res.data;
    } else {
        throw res.errMsg;
    }
}