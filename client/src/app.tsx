import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'

import 'taro-ui/dist/style/index.scss'
import { View } from "@tarojs/components";
import useAppModel from "@/models/appModel";
import { AtMessage } from 'taro-ui';

import request, { host } from "@/utils/request";

import "./app.scss";

type PropsType = {
  children?: React.ReactNode;
}

export default function App(props: PropsType) {
  const appModel = useAppModel();

  useEffect(function () {
    // init cloud development if in wechat mini app
    if ("weapp" === process.env.TARO_ENV) {
      Taro.cloud.init();
    }

    // try to get app current information
    (async function () {
      try {
        // res: {background, music, solgan}
        let res = await request({ url: "/api/setting/app_config/" });

        if (res?.background) {
          Taro.downloadFile({
            url: `${host}${res?.background}`,
            filePath: `${Taro.env.USER_DATA_PATH}/background.png`,
            success() {
              appModel.setBackground(`${Taro.env.USER_DATA_PATH}/background.png`);
            }
          });
        }

        if (res?.music) {
          Taro.downloadFile({
            url: `${host}${res?.music}`,
            filePath: `${Taro.env.USER_DATA_PATH}/music.mp3`,
            success() {
              appModel.setMusic(`${Taro.env.USER_DATA_PATH}/music.mp3`);
            }
          });
        }

        if (res?.solgan) {
          appModel.setSolgan(res?.solgan);
        }


      } catch (error) {

      }
    })();

    // try to get user information
    (async function () {
      try {
        let token = Taro.getStorageSync("token");
        if (token?.length === 0) {
          throw ("without token not login.");
        }

        let infoAuth = await Taro.authorize({ scope: "scope.userInfo" });
        if (infoAuth) {
          let infoRes = await Taro.getUserInfo();
          appModel.setCanI(true);
          appModel.setNickName(infoRes.userInfo.nickName);
          appModel.setAvatar(infoRes.userInfo.avatarUrl);
        }
      } catch (error) {

      }
    })();

    // try to read setting
    try {
      let mute = Taro.getStorageSync("mute");
      if (typeof (mute) === "boolean") {
        appModel.setMute(mute);
      } else {
        appModel.setMute(false);
      }
    } catch (error) {
      // do nothing
      console.log(error);
      appModel.setMute(false);
    }
  }, []);

  return (
    <View>
      <AtMessage />
      {props?.children}
    </View>
  );
}

