import React, { useEffect, useState } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";

import request, { host } from "@/utils/request";
import "./index.css";
import { AtActivityIndicator, AtList, AtListItem, AtMessage } from "taro-ui";

export default function Story() {
    const [types, setTypes] = useState(["全部", "漫画", "全部", "漫画", "全部", "漫画", "全部", "漫画", "全部", "漫画"]);
    const [type, setType] = useState("全部");
    const [storys, setStorys] = useState([] as any[]);
    const [loading, setLoading] = useState(false);

    useEffect(function () {
        fetchStory();
    }, []);

    async function fetchStory() {
        try {
            setLoading(true);
            let res = await request({ url: `/api/story/` });
            if (res !== undefined) {
                setLoading(false);
                setStorys(res);
            } else {
                throw ("request error");
            }
        } catch (error) {
            setLoading(false);
            Taro.atMessage({ message: "获取失败，请重试。", type: "error" });
        }
    }

    function handleStoryClick(id: number) {
        Taro.navigateTo({ url: `/pages/viewer/index?id=${id}` });
    }

    return (
        <View className="index">
            <AtMessage />
            <View>
                {loading &&
                    <AtActivityIndicator mode='center' isOpened={loading} content='加载中...' />
                }
                {!loading &&
                    <View>
                        <AtList>
                            {storys.map(function (o, i) {
                                return (
                                    <AtListItem title={o?.title} extraText={o?.type} onClick={handleStoryClick.bind(this, o?.id)} />
                                );
                            })}
                        </AtList>
                    </View>
                }
            </View>
        </View>
    )
}