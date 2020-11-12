import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";

import "./index.css";
import { AtMessage } from "taro-ui";

export default function Account() {
    return (
        <View className="index">
            <AtMessage />
        </View>
    );
}