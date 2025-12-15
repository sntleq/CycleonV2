"use client"
import { CartesianGrid, Line, LineChart, XAxis, ReferenceArea } from "recharts"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
    ChartLegendContent,
    ChartLegend,
} from "@/components/ui/chart"

interface ChartDataPoint {
    date: string
    [key: string]: string | number
}

interface ChartItem {
    value: string
    label: string
}

interface PredictionGraphProps {
    data: ChartDataPoint[]
    items: ChartItem[]
}

export function PredictionGraph({ data, items }: PredictionGraphProps) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const firstPredictionIndex = data.findIndex(d => {
        const dataDate = new Date(d.date)
        dataDate.setHours(0, 0, 0, 0)
        return dataDate > today
    })

    // 🔹 Chart config now maps VALUE → LABEL
    const chartConfig: ChartConfig = items.reduce((config, item, index) => {
        config[item.value] = {
            label: item.label,
            color: `var(--chart-${(index % 5) + 1})`,
        }
        return config
    }, {} as ChartConfig)

    return (
        <ChartContainer config={chartConfig}>
            <LineChart
                accessibilityLayer
                data={data}
                margin={{ left: 12, right: 12 }}
            >
                <defs>
                    <pattern
                        id="predictionPattern"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                    >
                        <rect width="10" height="10" fill="var(--ring)" opacity="0.1" />
                        <path
                            d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2"
                            stroke="var(--ring)"
                            strokeWidth="2"
                            opacity="0.4"
                        />
                    </pattern>
                </defs>

                <CartesianGrid vertical={false} />

                {firstPredictionIndex > 0 && (
                    <ReferenceArea
                        x1={data[firstPredictionIndex - 1].date}
                        x2={data[data.length - 1].date}
                        fill="url(#predictionPattern)"
                    />
                )}

                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                        })
                    }
                />

                <ChartTooltip
                    content={
                        <ChartTooltipContent
                            labelFormatter={(value) => {
                                const date = new Date(value)
                                date.setHours(0, 0, 0, 0)

                                const formatted = date.toLocaleDateString("en-PH", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })

                                return date > today
                                    ? `${formatted} (Prediction)`
                                    : formatted
                            }}
                        />
                    }
                />

                <ChartLegend content={<ChartLegendContent />} />

                {/* 🔹 Lines now use value as dataKey */}
                {items.map((item, index) => (
                    <Line
                        key={item.value}
                        dataKey={item.value}
                        type="monotone"
                        stroke={`var(--chart-${(index % 5) + 1})`}
                        strokeWidth={2}
                        dot={false}
                    />
                ))}
            </LineChart>
        </ChartContainer>
    )
}
