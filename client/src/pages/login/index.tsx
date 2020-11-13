import React, { useEffect, useState } from "react";
import Taro, { getCurrentInstance, useDidHide, useDidShow } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtButton, AtIcon, AtMessage } from "taro-ui";
import request from "@/utils/request";
import useAppModel from "@/models/appModel";

import "./index.css";

/**
 * 
 */
export default function Login() {
    const appModel = useAppModel();

    useEffect(function () {
        if (getCurrentInstance().router?.params?.logout === "true") {
            appModel.logout();
        }
    }, []);

    /**
     * 
     * @param e 
     */
    async function handleLoginClick(e: any) {
        try {
            Taro.showLoading({ title: "登录中...", mask: true });
            /* not ger permission to get user information, throw a error */
            if ("getUserInfo:ok" !== e?.detail?.errMsg) {
                throw "some login error happend.";
            }

            /* try to ask WeChat API to login, if not successful just throw a error */
            let loginRes = await Taro.login();
            if ("login:ok" !== loginRes?.errMsg || undefined === loginRes.code) {
                throw "some login error happend.";
            }

            /* try to login to server and get a token */
            let res = await request({
                url: "/api/wechat/wechat_login/",
                method: "POST",
                data: {
                    "code": loginRes.code,
                    "nickName": e.detail.userInfo.nickName,
                    "gender": e.detail.userInfo.gender,
                    "avatarUrl": e.detail.userInfo.avatarUrl
                }
            });

            if (res?.token === undefined) {
                throw "some login error happend.";
            }

            res !== undefined && Taro.hideLoading();

            Taro.setStorageSync("token", res?.token);

            // set app global config
            appModel.setCanI(true);
            appModel.setAvatar(e.detail.userInfo.avatarUrl);
            appModel.setNickName(e.detail.userInfo.nickName);

            // tip for successful login
            Taro.atMessage({ message: "登录成功。", type: "success" });

            // navigate back
            setTimeout(function () {

                Taro.navigateBack({ delta: 1 });
            }, 1000);
        } catch (error) {
            Taro.hideLoading();
            Taro.atMessage({ message: "登录失败，请重试。", type: "error" });
            console.log(error);
        }
    }

    /**
     * 
     */
    return (
        <View className="index">
            <AtMessage />
            <View className="logo-wrap">
                <AtIcon value='user' size='128' color="rgba(193,203,215, 1)"></AtIcon>
            </View>
            <View>
                <AtButton type="primary" size="normal" disabled={appModel.canI}
                    openType="getUserInfo" onGetUserInfo={handleLoginClick}>使用微信登录</AtButton>
            </View>
        </View>
    );
}