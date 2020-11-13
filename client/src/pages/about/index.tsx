import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

import { logo } from "./logo";
import "./index.css";

/**
 * 
 */
export default function About() {
    return (
        <View className="index">
            <View className="logo-wrap">
                <View style={{ background: `url(${logo})` }} className="logo"></View>
                <View className="logo-name">心理捕手</View>
                <View className="logo-version">版本 1.0</View>
            </View>
            <View className="slogan-wrap">
                <View className="slogan-text">
                    <Text>有多少个夜深人静的夜晚</Text>
                    <Text>你也曾陷入了深深的痛苦和自责</Text>
                    <Text>{"\n"}</Text>
                    <Text>抑郁</Text>
                    <Text>不是矫情不是做作</Text>
                    <Text>而是需要救治的</Text>
                    <Text>就像感冒一样</Text>
                    <Text>是可以通过治疗痊愈的</Text>
                    <Text>{"\n"}</Text>
                    <Text>所以</Text>
                    <Text>抑郁不是你的错</Text>
                    <Text>请把手交给我</Text>
                    <Text>我带你去感受阳光</Text>
                </View>
            </View>
        </View>
    );
}