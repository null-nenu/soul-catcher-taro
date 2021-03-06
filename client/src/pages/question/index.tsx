import React, { useEffect, useState } from "react";
import Taro, { getCurrentInstance, useDidHide, useDidShow } from "@tarojs/taro";
import { View } from "@tarojs/components";

import request, { host } from "@/utils/request";
import "./index.css";
import { AtButton, AtIcon, AtProgress, AtActivityIndicator, AtMessage } from "taro-ui";
import useAppModel from "@/models/appModel";
import colorful from "@/utils/colorful";

export default function Question() {
    const appModel = useAppModel();
    const [id, setId] = useState(undefined as undefined | string);
    const [loading, setLoading] = useState(false);
    const [evaluation, setEvaluation] = useState(undefined as any);
    const [indexQ, setIndexQ] = useState(0);
    const [choices, setChoices] = useState([] as number[]);
    const [audio, setAudio] = useState(Taro.createInnerAudioContext());
    const [colors, setColors] = useState(colorful());

    /**
     * 
     */
    useEffect(function () {
        // get & set evaluation id
        if (getCurrentInstance().router?.params?.id) {
            setId(getCurrentInstance().router?.params?.id);
            if (audio !== undefined) {
                audio.loop = true;
            }
        }

        return (
            function () {
                if (audio !== undefined) {
                    audio.pause();
                }
            }
        );
    }, []);

    /**
     * 
     */
    useEffect(function () {
        if (id !== undefined) {
            fetchEvaluation(id);
        }
    }, [id]);

    /**
     * 
     */
    useEffect(function () {
        if (appModel.music !== undefined) {
            audio.src = appModel.music;
            if (appModel.mute !== true) {
                audio.play();
            }
        }
    }, [appModel.music]);

    /**
     * 
     */
    useEffect(function () {
        if (appModel.music !== undefined && audio !== undefined) {
            if (appModel.mute !== true) {
                audio.play();
            } else {
                audio.pause();
            }
        }
    }, [appModel.mute]);

    /**
     * 
     */
    useDidShow(function () {
        if (appModel.music !== undefined && appModel.mute !== true && audio !== undefined && audio?.src !== undefined) {
            audio.play();
        }
    });

    /**
     * 
     * @param id 
     */
    async function fetchEvaluation(id: string) {
        try {
            setLoading(true);
            let res = await request({ url: `/api/evaluation/${id}/details/` });
            if (res !== undefined) {
                setLoading(false);
                setEvaluation(res);
            } else {
                throw ("request error");
            }
        } catch (error) {
            setLoading(false);
            Taro.atMessage({ message: "获取量表详情失败，请重试。", type: "error" });
        }
    }

    /**
     * 
     * @param data 
     */
    async function postEvaluation(data: any) {
        try {
            Taro.showLoading({ title: "评测中...", mask: true });
            let res = await request({ url: `/api/evaluation/score/`, method: 'POST', data: data });
            if (res !== undefined) {
                Taro.hideLoading();
                if (res?.id !== undefined) {
                    Taro.redirectTo({ url: `/pages/score/index?id=${res?.id}` });
                }
            }
        } catch (error) {
            Taro.hideLoading();
        }
    }

    /**
     * 
     * @param optionId 
     */
    function handleOptionClick(optionId: number) {
        if (indexQ === choices.length) {
            let new_choices = [...choices, optionId];
            setChoices(new_choices);
            if (indexQ < (evaluation?.questions?.length || 0) - 1) {
                setIndexQ(indexQ + 1);
            } else {
                //
                let postData = {
                    evaluation: id,
                    options: new_choices
                };
                postEvaluation(postData);
            }
        }
    }

    /**
     * 
     */
    function handleVolumeClick() {
        if (appModel.music !== undefined) {
            appModel.setMute(!appModel.mute);
        } else {
            Taro.showToast({ icon: "none", title: "很抱歉，音乐暂不可用" });
        }
    }

    /**
     * 
     */
    return (
        <View className="index">
            <AtMessage />
            {loading &&
                <AtActivityIndicator mode='center' isOpened={loading} content='评测加载中...' />
            }
            {(!loading && evaluation !== undefined) &&
                <View>
                    <View className="progress-wrap">
                        <AtProgress percent={(choices.length / (evaluation?.questions?.length || 0)) * 100} isHidePercent={true} />
                    </View>
                    <View className="volume-wrap">
                        <View style={{ fontSize: "28rpx", color: "lightblue" }}>
                            {indexQ + 1}/{evaluation?.questions?.length}
                        </View>
                        <View onClick={handleVolumeClick} className="volume-button">
                            {appModel.music === undefined &&
                                <AtIcon value="blocked" size="18" />
                            }
                            {(appModel.music !== undefined && appModel.mute) &&
                                <AtIcon value="volume-off" size="18" />
                            }
                            {(appModel.music !== undefined && !appModel.mute) &&
                                <AtIcon value="volume-plus" size="18" />
                            }
                        </View>
                    </View>
                    <View>
                        {evaluation?.questions?.map(function (question: any, iQ: number) {
                            if (indexQ === iQ) {
                                return (
                                    <View className="question">
                                        <View className="content">{question?.content}</View>
                                        <View>
                                            {question?.options?.map(function (option: any, iO: number) {
                                                return (
                                                    <View className="option"
                                                        style={{ background: colors?.[iO % colors?.length] || "rgb(220, 220, 220)" }}
                                                        onClick={handleOptionClick.bind(this, option?.id)}
                                                    >
                                                        <View>{option?.content}</View>
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </View>
                                )
                            }
                        })}
                    </View>
                </View>
            }
        </View >
    );
}