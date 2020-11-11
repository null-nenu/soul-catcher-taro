import React, { useEffect, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";

import request, { host } from "@/utils/request";
import "./index.css";
import { AtActivityIndicator, AtButton } from "taro-ui";

export default function Score() {
    const [id, setId] = useState(undefined as undefined | string);
    const [record, setRecord] = useState(undefined as any);
    const [recommands, setRecommands] = useState([] as any[]);
    const [loading, setLoading] = useState(false);

    useEffect(function () {
        // get & set evaluation id
        if (getCurrentInstance().router?.params?.id) {
            setId(getCurrentInstance().router?.params?.id);
        }
    }, []);

    useEffect(function () {
        if (id !== undefined) {
            fetchScore(id);
            fetchRecommands(id);
        }
    }, [id]);

    //
    async function fetchScore(id: string) {
        try {
            setLoading(true);
            let res = await request({ url: `/api/evaluation_record/${id}/details/` });
            if (res !== undefined) {
                setLoading(false);
                setRecord(res);
            } else {
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    }

    async function fetchRecommands(id: string) {
        try {
            let res = await request({ url: `/api/story/recommend/?id=${id}` });
            if (res !== undefined) {
                setRecommands(res);
            }
        } catch (error) {

        }
    }

    //
    function handleRecommand(id: string) {
        Taro.navigateTo({ url: `/pages/viewer/index?id=${id}` });
    }

    return (
        <View className="index">
            {loading &&
                <AtActivityIndicator mode='center' isOpened={loading} content='评测分析中...' />
            }
            {!loading &&
                <View>
                    <View className="level">
                        <View className="level">
                            <View className="level-text">{record?.level}</View>
                        </View>
                    </View>
                    <View>
                        <View className="box-wrap">
                            <View className="analysis">
                                <View className="box-tip">小分析</View>
                                <View>{record?.analysis}</View>
                            </View>
                            <View style={{ height: "48rpx" }}></View>
                            <View className="advice">
                                <View className="box-tip">小建议</View>
                                <View>{record?.advice}</View>
                            </View>
                        </View>
                        <View className="recommands">
                            <View className="recommands-tip">散散心</View>
                            {recommands.map(function (recommand: any, index: number) {
                                return (
                                    <View className="recommand"
                                        onClick={handleRecommand.bind(this, recommand?.id)}
                                    >
                                        <View>{recommand?.title}</View>
                                    </View>
                                );
                            })}
                        </View>
                        <View className="download">
                            <View className="download-tip">下载</View>
                            <View className="download-text">
                                <View>评测记录只用于帮助专业人士分析您的心理状态，如非必要，您无需获取本记录。</View>
                                <View style={{ height: "16rpx" }}></View>
                                <AtButton size="small" type="primary">获取本次评测记录</AtButton>
                            </View>
                        </View>
                    </View>
                </View>
            }
        </View>
    );
}