import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'

import 'taro-ui/dist/style/index.scss'
import { View } from "@tarojs/components";
import useAppModel from "@/models/appModel";
import { AtMessage } from 'taro-ui';

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

    // try to get user information
    (async function () {
      try {
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
  }, []);

  return (
    <View>
      <AtMessage />
      {props?.children}
    </View>
  );
}

