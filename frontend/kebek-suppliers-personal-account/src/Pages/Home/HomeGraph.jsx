import React from "react";
import { Bar } from "@ant-design/charts";
import { Card } from "@mui/material"
import { Pie, G2 } from '@ant-design/plots';
import { statusList } from "../../components/Status/constants"

const HomeGraph = ({ dashboardOrders, locale }) => {

    const dashboardOrdersResult = React.useMemo(() => {
        const res = [];
        dashboardOrders.forEach((dashboardItem) => {
            return Object.keys(dashboardItem).forEach((s) => {
                const value = dashboardItem[s];
                const status = (s.length === 2 && s !== "id") && s.toUpperCase();
                return statusList.forEach((stList) => {
                    return (stList.encryptedName === status && value !== 0) && res.push({ name: locale === "ru" ? stList.pluralName : stList.pluralNameKk, value, titleRu: dashboardItem.titleRu.length > 20 ? `${dashboardItem.titleRu.slice(0, 15)}...` : dashboardItem.titleRu, titleKk: dashboardItem.titleKk > 20 ? `${dashboardItem.titleKk.slice(0, 15)}...` : dashboardItem.titleKk, id: dashboardItem.id })
                })
            })
        })
        return res
    }, [dashboardOrders])


    const config = {
        data: !!dashboardOrdersResult?.length ? dashboardOrdersResult : [],
        isStack: true,
        xField: 'value',
        yField: 'titleRu',
        seriesField: 'name',
        borderBase: "1px solid red",
        radius: 0.8,
        label: {
            position: 'middle',
            layout: [
                {
                    type: 'interval-adjust-position',
                },
                {
                    type: 'interval-hide-overlap',
                },
                {
                    type: 'adjust-color',
                },
            ],
        },
        // tooltip: {
        //     customContent: (title, items) => {
        //         return (
        //             <>
        //                 <h5 style={{ marginTop: 16 }}>{title}</h5>
        //                 <ul style={{ paddingLeft: 0 }}>
        //                     {items?.map((item, index) => {
        //                         const { name, value, color } = item;
        //                         return (
        //                             <li
        //                                 key={item.year}
        //                                 className="g2-tooltip-list-item"
        //                                 data-index={index}
        //                                 style={{ marginBottom: 4, display: 'flex', alignItems: 'center' }}
        //                             >
        //                                 <span className="g2-tooltip-marker" style={{ background: "#F6F4FE", border: "1px solid #9593F2" }}></span>
        //                                 <span
        //                                     style={{ display: 'inline-flex', flex: 1, justifyContent: 'space-between' }}
        //                                 >
        //                                     <span style={{ marginRight: 16 }}>{name}:</span>
        //                                     <span className="g2-tooltip-list-item-value">{value}</span>
        //                                 </span>
        //                             </li>
        //                         );
        //                     })}
        //                 </ul>
        //             </>
        //         );
        //     },
        // },
        // color: ['#EDF4FE', '#F6F4FE', "#D6EFE6"],
        border: ["1px solid black"],
        style: { fill: '#000' },
    };
    return (
        <Card className={"w-100 mt-4 p-4"}>
            <Bar {...config} />
        </Card>
    )
};

export default HomeGraph
