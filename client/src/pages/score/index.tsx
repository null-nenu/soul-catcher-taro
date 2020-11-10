import React, { useEffect, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";

import request, { host } from "@/utils/request";
import "./index.css";

export default function Score() {
    const [id, setId] = useState(undefined as undefined | string);
    const [record, setRecord] = useState(undefined as any);
    const [recommands, setRecommands] = useState([] as any[]);

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
            let res = await request({ url: `/api/evaluation_record/${id}/details/` });
            if (res !== undefined) {
                setRecord(res);
            }
        } catch (error) {

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
            <View>
                <View>{record?.level}</View>
            </View>
            <View>
                <View><View>{record?.analysis}</View></View>
                <View><View>{record?.advice}</View></View>
                <View>
                    {recommands.map(function (recommand: any, index: number) {
                        return (
                            <View onClick={handleRecommand.bind(this, recommand?.id)}>
                                <View>{recommand?.title}</View>
                            </View>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}