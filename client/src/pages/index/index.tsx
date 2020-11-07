import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";
import { AtButton, AtAvatar, AtIcon, AtMessage } from "taro-ui";
import backgroundImage from "./background";
import useAppModel from "@/models/appModel";

import './index.scss'

export default function Index() {
  const [statusBarHeight, setStatusBarHeight] = useState(30);
  const [titleBarHeight, setTitleBarHeight] = useState(44);
  const [background, setBackground] = useState("");
  const appModel = useAppModel();

  useEffect(function () {
    // set NavBarHeight
    (async function () {
      try {
        let info = await Taro.getSystemInfo();
        setStatusBarHeight(info.statusBarHeight);

        let titleBarHeight = 44

        if (info.system?.indexOf('Android') !== -1) {
          titleBarHeight = 54
        }

        setTitleBarHeight(titleBarHeight);
      } catch (error) {

      }
    })();

    // try to ge background image
    (async function () {
      setBackground(backgroundImage);
    })();
  }, []);

  function handleLoginClick() {
    if (appModel.canI === true) {
      // logined
      Taro.navigateTo({ url: "/pages/account/index" });
    } else {
      Taro.navigateTo({ url: "/pages/login/index" });
    }
  }

  function handleStartClick() {
    Taro.navigateTo({ "url": "/pages/tests/index" });
  }

  return (
    <View className="index" style={{ background: `url(${background})`, backgroundSize: 'cover' }}>
      <View style={{ height: `${statusBarHeight}px` }} />
      <View className='at-row' style={{ height: `${titleBarHeight}px` }}>
        <View className='at-col'>
          <View onClick={handleLoginClick} style={{ display: "block" }}>
            <AtAvatar size="small" customStyle={{ fontSize: 30 }} className={`${appModel.canI ? "" : "at-icon at-icon-user"}`} image={`${appModel.canI ? appModel.avatar : ""}`} />
          </View>
        </View>
        <View className='at-col'></View>
      </View>
      <View style={{ height: `calc(100vh - ${statusBarHeight}px - ${titleBarHeight}px - 256rpx)` }}>
        <View className='at-row' style={{ paddingTop: "128rpx" }}>
          <View className='at-col'>
            <AtButton className="start-button" onClick={handleStartClick}>开始</AtButton>
          </View>
        </View>
        <View className='at-row' style={{ paddingTop: "64rpx", justifyContent: "center" }}>
          <Text className="daily-words">你从来都不是一座孤岛</Text>
        </View>
      </View>
      <View className='at-row' style={{ height: "256rpx" }}>
        <View className='at-col sub-button-wrap'>
          <AtButton className="sub-button">心理漫画</AtButton>
        </View>
        <View className='at-col  sub-button-wrap'>
          <AtButton className="sub-button">评测记录</AtButton>
        </View>
      </View>
    </View >
  );
}


