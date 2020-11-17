import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Button } from "@tarojs/components";

import "./index.css";

/**
 * 
 */
export default function Declare() {
    return (
        <View className="index">
            <View style={{ fontSize: "28rpx" }}>
                <View>1、	一切用户在浏览并使用产品时均被视为已经仔细阅读本条款并完全同意。凡以任何方式登陆本产品，或直接、间接使用本产品资料者，均被视为自愿接受本产品相关声明和用户服务协议的约束。</View>
                <View>2、	本产品提供测试的结果仅供参考，不能替代医疗手段，不做任何保证。若用户产生任何意外情况，本软件概不负责，亦不承担任何法律责任。</View>
                <View>3、	产品所应用的文字、图片、音视频等资料，均来自互联网开放资源，如果侵犯了第三方的知识产权或其他权利，责任由作者或转载者本人承担，本产品对此不承担责任。</View>
                <View>4、	本产品不保证为向用户提供便利而设置的外部链接的准确性和完整性，同时，对于该外部链接指向的不由软件实际控制的任何网页上的内容，本软件不承担任何责任。</View>
                <View>5、	对于因不可抗力或因黑客攻击、通讯线路中断等软件不能控制的原因造成的网络服务中断或其他缺陷，导致用户不能正常使用软件，本产品不承担任何责任。</View>
                <View>6、	本声明未涉及的问题请参见国家有关法律法规，当本声明与国家有关法律法规冲突时，以国家法律法规为准。</View>
                <View>7、	产品相关声明版权及其修改权、更新权和最终解释权均属本产品团队所有。</View>
            </View>
        </View>
    );
}