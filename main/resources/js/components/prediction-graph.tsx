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

export const description = "A multiple line chart with predictions"

interface ChartDataPoint {
    date: string
    [key: string]: string | number
}

interface PredictionGraphProps {
    data: ChartDataPoint[]
    items: string[]
}

export function PredictionGraph({ data, items }: PredictionGraphProps) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const firstPredictionIndex = data.findIndex(d => {
        const dataDate = new Date(d.date)
        dataDate.setHours(0, 0, 0, 0)
        return dataDate > today
    })

    // Generate chart config dynamically based on items
    const chartConfig: ChartConfig = items.reduce((config, item, index) => {
        config[item] = {
            label: item,
            color: `var(--chart-${(index % 5) + 1})`,
        }
        return config
    }, {} as ChartConfig)

    return (
        <ChartContainer config={chartConfig}>
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                }}
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

                {/* Shaded area for predictions */}
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
                    tickFormatter={(value) => {
                        const date = new Date(value)
                        return date.toLocaleDateString("en-PH", {
                            month: "short",
                            day: "numeric",
                        })
                    }}
                />
                <ChartTooltip
                    content={<ChartTooltipContent
                        labelFormatter={(value, payload) => {
                            const date = new Date(value)
                            date.setHours(0, 0, 0, 0)
                            const isPrediction = date > today
                            const formattedDate = date.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })
                            return isPrediction ? `${formattedDate} (Prediction)` : formattedDate
                        }}
                    />}
                />
                <ChartLegend content={<ChartLegendContent />} />

                {/* Dynamically render lines based on items */}
                {items.map((item, index) => (
                    <Line
                        key={item}
                        dataKey={item}
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
