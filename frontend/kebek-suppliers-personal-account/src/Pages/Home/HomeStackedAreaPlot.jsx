import React, { useState, useEffect } from 'react';
import { Area } from '@ant-design/plots';
import { Card } from "@mui/material"
import { format, parseISO } from "date-fns"

const HomeStackedAreaPlot = ({ selectYearOrMonth, dashboardProfit }) => {

    const dashboardProfitResult = React.useMemo(() => {
        const res = [];
        dashboardProfit.forEach((item) => {
            return !!item.profits?.length && item.profits.forEach((profit) => res.push({
                titleRu: item.titleRu,
                titleKk: item.titleKk,
                createdAt: format(parseISO(profit.createdAt), selectYearOrMonth),
                profit: profit.profit,
                id: item.id,
            }))
        })
        return res
    }, [dashboardProfit, selectYearOrMonth])

    const config = {
        data: !!dashboardProfitResult?.length ? dashboardProfitResult : [],
        xField: 'createdAt',
        yField: 'profit',
        seriesField: 'titleRu',
        color: ["#2F80ED", "#2D9CDB", "#56CCF2"]
    };

    return <Card className={"w-100 mt-4 p-4"}>
        <Area {...config} />
    </Card>
};

export default HomeStackedAreaPlot