// src/components/MainContainer.tsx
import React, { useState } from "react";
import HeaderBar from "./HeaderBar";
import MainContent from "./MainContent";

export type Metric = {
    viewsCount: number,
    trendingRate: number,
    region: string
}

export type Source = {
    title: string;
    text: string;
    image: string;
    link: string;
    logo: string;
    metrics: Metric;
}

export type Chat = {
    query: string;
    sources: Source[];
}

const MainContainer: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);

    const addQuery = (query: string) => {
        setChats((prevChats): Chat[] => [...prevChats, { query: query, sources: [{
            title: "Who Is Favored To Win The 2024 US Election?",
            text: "Much like Democratic presidential candidates in 2016 and 2020, Vice President Kamala Harris has moved the needle in her favor on betting markets and in polling following last week's debate with former President Donald Trump. The shift in the 2024 presidential race offshore-betting odds is more muted than Trump's other opening debates. Still, in the few percentage points he's ceded, bettors now say Harris is more likely to win, according to Polymarket, a crypto-trading platform. The presidential election betting can't be done legally in the U.S. Trump's and Harris' likelihood of winning were knotted at 49% as the debate ended. After moving slightly in Trump's favor the following morning, Polymarket bettors have given Harris a better chance of winning. Her probability stood at 52% to Trump's 47% as of 10:30 a.m. EDT Thursday. Much like Democratic presidential candidates in 2016 and 2020, Vice President Kamala Harris has moved the needle in her favor on betting markets and in polling following last week's debate with former President Donald Trump. The shift in the 2024 presidential race offshore-betting odds is more muted than Trump's other opening debates. Still, in the few percentage points he's ceded, bettors now say Harris is more likely to win, according to Polymarket, a crypto-trading platform. The presidential election betting can't be done legally in the U.S. Trump's and Harris' likelihood of winning were knotted at 49% as the debate ended. After moving slightly in Trump's favor the following morning, Polymarket bettors have given Harris a better chance of winning. Her probability stood at 52% to Trump's 47% as of 10:30 a.m. EDT Thursday. Much like Democratic presidential candidates in 2016 and 2020, Vice President Kamala Harris has moved the needle in her favor on betting markets and in polling following last week's debate with former President Donald Trump. The shift in the 2024 presidential race offshore-betting odds is more muted than Trump's other opening debates. Still, in the few percentage points he's ceded, bettors now say Harris is more likely to win, according to Polymarket, a crypto-trading platform. The presidential election betting can't be done legally in the U.S. Trump's and Harris' likelihood of winning were knotted at 49% as the debate ended. After moving slightly in Trump's favor the following morning, Polymarket bettors have given Harris a better chance of winning. Her probability stood at 52% to Trump's 47% as of 10:30 a.m. EDT Thursday.",
            image: "https://via.placeholder.com/150",
            link: "-cnn.article.link.goes.here.com",
            logo: "https://via.placeholder.com/150",
            metrics: { viewsCount: 483, trendingRate: 22, region: 'Atlanta, USA' }
        }] }]);
    };

    return (
        <div className="h-screen bg-screen-black text-white flex flex-col font-inter">
            <HeaderBar title={chats.length > 0 ? chats[0].query : ''} />
            <MainContent chats={chats} addQuery={addQuery} />
        </div>
    )
}

export default MainContainer;