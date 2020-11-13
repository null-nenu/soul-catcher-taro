import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";

import "./index.css";
import { AtAvatar, AtList, AtListItem, AtLoadMore, AtMessage, AtSwitch } from "taro-ui";
import useAppModel from "@/models/appModel";

export default function Account() {
    const appModel = useAppModel();

    function handleMuteClick() {
        appModel.setMute(!appModel.mute);
    }

    function handleLogoutClick() {
        Taro.showModal({
            title: "退出登录",
            content: '您是否要退出登录?退出登录后将无法记录您的评测。',
            success: function (res) {
                if (res.confirm) {
                    appModel.logout();
                    Taro.atMessage({ message: "退出登录成功。", type: "success" });
                    setTimeout(function () {
                        Taro.navigateBack({ delta: 1 });
                    }, 1000);
                } else if (res.cancel) {
                    Taro.atMessage({ message: "已取消操作。", type: "info" });
                }
            }
        })
    }

    function handleAboutClick() {
        Taro.navigateTo({ url: "/pages/about/index" });
    }

    function handleDeclareClick() {
        Taro.navigateTo({ url: "/pages/declare/index" });
    }

    function handleThanksClick() {
        Taro.navigateTo({ url: "/pages/thanks/index" });
    }

    return (
        <View className="index">
            <AtMessage />
            {appModel.canI === true &&
                <View>
                    <View className="user-wrap">
                        <View className="at-row user-center">
                            <AtAvatar image={`${appModel.avatar}`} size="large" />
                            <View className="user-name">{appModel.nickName}</View>
                        </View>
                    </View>
                    <View className="setting-wrap">
                        <View className="tip">设置</View>
                        <View>
                            <AtSwitch title="评测时播放音乐" customStyle={{ marginLeft: "0" }}
                                checked={!appModel.mute} onChange={handleMuteClick} />
                        </View>
                    </View>
                    <View className="setting-wrap">
                        <View className="tip">账号</View>
                        <View>
                            <AtList>
                                <AtListItem title='退出登录' onClick={handleLogoutClick} />
                                <AtListItem title='删除账号' arrow='right' />
                            </AtList>
                        </View>
                    </View>
                    <View className="setting-wrap">
                        <View className="tip">关于</View>
                        <View>
                            <AtList>
                                <AtListItem title='致谢' arrow='right' onClick={handleThanksClick} />
                                <AtListItem title='免责声明' arrow='right' onClick={handleDeclareClick} />
                                <AtListItem title='关于应用' arrow='right' onClick={handleAboutClick} />
                            </AtList>
                        </View>
                    </View>
                </View>
            }
            {appModel.canI === false &&
                <AtLoadMore status="noMore" noMoreText="已退出登录，将返回到首页。" />
            }
        </View>
    );
}