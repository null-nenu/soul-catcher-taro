import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";

import "./index.css";
import { AtButton, AtIcon, AtLoadMore, AtMessage } from "taro-ui";

import request from "@/utils/request";
import useAppModel from "@/models/appModel";

/**
 * 
 */
export default function Destroy() {
    const appModel = useAppModel();

    /**
     * 
     */
    function handleDestroyClick() {
        Taro.showModal({
            title: "删除账号",
            content: "删除账号操作将清除您的全部评测数据，是否继续？",
            success: async function (res) {
                if (res.confirm) {
                    try {
                        Taro.showLoading({ title: "删除中...", mask: true });
                        let res = await request({ url: `/api/user/destory/`, method: "POST" });
                        console.log(res);
                        if (res !== undefined) {
                            Taro.hideLoading();
                            Taro.atMessage({ message: "删除账号成功。", type: "success" });
                            appModel.logout();
                            setTimeout(function () {
                                Taro.redirectTo({ url: "/pages/index/index" });
                            }, 1000);
                        } else {
                            throw ("some error");
                        }
                    } catch (error) {
                        Taro.hideLoading();
                        Taro.atMessage({ message: "删除账号失败，请重试。", type: "error" });
                    }
                } else if (res.cancel) {
                    Taro.atMessage({ message: "操作已取消。", type: "info" });
                }
            }
        })
    }

    /**
     * 
     */
    return (
        <View className="index">
            <AtMessage />
            {appModel.canI === true &&
                <View>
                    <View className="logo">
                        <AtIcon value='close-circle' size='128' color="#E0CDCF"></AtIcon>
                    </View>
                    <View className="tip">
                        删除账号操作将清除您的全部评测数据，请您慎重考虑该操作。
                    </View>
                    <View className="delete">
                        <AtButton type="primary" onClick={handleDestroyClick}>删除账号</AtButton>
                    </View>
                </View>
            }
            {appModel.canI === false &&
                <AtLoadMore status="noMore" noMoreText="已删除账号，将返回到首页。" />
            }
        </View>
    );
}