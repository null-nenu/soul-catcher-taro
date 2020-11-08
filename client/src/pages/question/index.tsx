import React, { useEffect, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";

import request, { host } from "@/utils/request";
import "./index.css";
import { AtButton, AtIcon, AtProgress } from "taro-ui";
import useAppModel from "@/models/appModel";

export default function Question() {
    const appModel = useAppModel();
    const [id, setId] = useState(undefined as undefined | string);
    const [loading, setLoading] = useState(false);
    const [evaluation, setEvaluation] = useState({} as any);
    const [indexQ, setIndexQ] = useState(0);
    const [choices, setChoices] = useState([] as number[])

    useEffect(function () {
        // get & set evaluation id
        if (getCurrentInstance().router?.params?.id) {
            setId(getCurrentInstance().router?.params?.id);
        }
    }, []);

    // do something when id changed
    useEffect(function () {
        if (id !== undefined) {
            fetchEvaluation(id);
        }
    }, [id]);

    async function fetchEvaluation(id: string) {
        try {
            setLoading(true);
            let res = await request({ url: `/api/evaluation/${id}/details/` });
            if (res !== undefined) {
                setLoading(false);
                setEvaluation(res);
            }
        } catch (error) {
            setLoading(false);
        }
    }

    function handleOptionClick(id: number) {
        let new_choices = [...choices, id];
        setChoices(new_choices);

        if (indexQ < (evaluation?.questions?.length || 0) - 1) {
            setIndexQ(indexQ + 1);
        } else {
            Taro.redirectTo({ url: "/pages/score/index" });
        }
    }

    function handleVolumeClick() {
        if (appModel.music !== undefined) {
            appModel.setMute(!appModel.mute);
        } else {
            Taro.showToast({ icon: "none", title: "很抱歉，音乐暂不可用" });
        }
    }

    return (
        <View className="index">
            <View>
                <View>
                    <AtProgress percent={(choices.length / (evaluation?.questions?.length || 0)) * 100} isHidePercent={true} />
                </View>
                <View>
                    <AtButton size="small" full={false} circle={true} onClick={handleVolumeClick} className="volume-button">
                        {appModel.music === undefined &&
                            <AtIcon value="blocked" size="18"/>
                        }
                        {(appModel.music !== undefined && appModel.mute) &&
                            <AtIcon value="volume-off" size="18"/>
                        }
                        {(appModel.music !== undefined && !appModel.mute) &&
                            <AtIcon value="volume-plus" size="18"/>
                        }
                    </AtButton>
                </View>
                <View>
                    {evaluation?.questions?.map(function (question: any, iQ: number) {
                        if (indexQ === iQ) {
                            return (
                                < View >
                                    <View>{question?.content}</View>
                                    <View>
                                        {question?.options?.map(function (option: any, iO: number) {
                                            return (
                                                <View onClick={handleOptionClick.bind(this, option?.id)}>
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
        </View >
    );
}