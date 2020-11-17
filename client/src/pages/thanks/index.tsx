import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";

import "./index.css";

/**
 * 
 */
export default function Thanks() {
    return (
        <View className="index">
            <View style={{ fontSize: "28rpx" }}>
                <View>《心灵捕手》团队由衷的感谢心理学专家对《心灵捕手心理测评》产品的支持和专业性的帮助。</View>
                <View>同时向徐慢慢心理话的编辑团队表示诚挚的感谢。</View>
                <View>产品尚处于发展阶段，还存在许多不足之处。</View>
                <View>如您愿意提供相关建议，团队一定认真对待。</View>
                <View>联系邮箱：心灵捕手项目组18843178326@163.com。</View>
            </View>
        </View>
    );
}