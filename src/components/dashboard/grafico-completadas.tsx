"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
	Card,
	CardContent
} from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
	completadas: {
		label: "Completadas",
		color: "hsl(var(--chart-1))",
	},
	totales: {
		label: "Totales",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export function GraficoCompletadas( {chartData} : {chartData: {mes: string, completadas: number, totales: number}[] }) {
	return (
		<Card>
			<CardContent>
				<ChartContainer config={chartConfig}>
					<BarChart accessibilityLayer data={chartData}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="mes"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tickFormatter={value => value.slice(0, 3)}
						/>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent indicator="dashed" />}
						/>
						<Bar dataKey="completadas" fill="var(--color-completadas)" radius={4} />
						<Bar dataKey="totales" fill="var(--color-totales)" radius={4} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
