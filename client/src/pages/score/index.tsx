import React, { useEffect, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";

import request, { host } from "@/utils/request";
import "./index.css";
import { AtActivityIndicator, AtButton, AtMessage } from "taro-ui";

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
                throw("request error");
            }
        } catch (error) {
            setLoading(false);
            Taro.atMessage({ message: "获取评测详情失败，请重试。", type: "error" });
        }
    }

    async function fetchRecommands(id: string) {
        try {
            let res = await request({ url: `/api/story/recommend/?id=${id}` });
            if (res !== undefined) {
                setRecommands(res);
            } else {
                throw ("request error");
            }
        } catch (error) {
            Taro.atMessage({ message: "推荐获取失败。", type: "error" });
        }
    }

    //
    function handleRecommand(id: string) {
        Taro.navigateTo({ url: `/pages/viewer/index?id=${id}` });
    }

    async function handleSaveClick() {
        try {
            Taro.showLoading({ title: "获取评测中...", mask: true });
            let res = await request({ url: `/api/evaluation_record/getdetail/?id=${id}` });
            if (res !== undefined) {
                Taro.downloadFile({
                    url: `${host}${res?.url}`,
                    success: function (res) {
                        if (res.statusCode === 200) {
                            Taro.saveImageToPhotosAlbum({
                                filePath: res.tempFilePath,
                                success: function () {
                                    Taro.hideLoading();
                                    Taro.atMessage({ message: "获取本次评测记录成功，请前往图库应用查看。", type: "success" });
                                },
                                fail: function () {
                                    throw ('save to album error.');
                                }
                            })
                        } else {
                            throw ('download error.');
                        }
                    }
                })
            } else {
                throw ("request error");
            }
        } catch (error) {
            Taro.hideLoading();
            Taro.atMessage({ message: "下载评测记录失败，请重试。", type: "error" });
        }
    }

    return (
        <View className="index">
            <AtMessage />
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
                                <AtButton size="small" type="primary" onClick={handleSaveClick}>获取本次评测记录</AtButton>
                            </View>
                        </View>
                    </View>
                </View>
            }
        </View>
    );
}