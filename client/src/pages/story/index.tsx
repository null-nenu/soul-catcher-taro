import React, { useEffect, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";

import request, { host } from "@/utils/request";
import "./index.css";

export default function Story() {
    return (
        <View className="index"></View>
    );
}