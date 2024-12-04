"use client";

import { LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
	tareas: {
		label: "Tareas",
	},
	ianguita: {
		label: "Ivan Anguita",
		color: "hsl(var(--chart-1))",
	},
	hklaus: {
		label: "Hegely Klaus",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export function GraficoUsuarios({
	usuariosTareas,
}: {
	usuariosTareas: { usuario: string; tareas: number; fill: string }[];
}) {
	return (
		<Card className="flex flex-col">
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="mx-auto aspect-square max-h-[350px] [&_.recharts-text]:fill-background"
				>
					<PieChart>
						<ChartTooltip
							content={<ChartTooltipContent nameKey="tareas" hideLabel />}
						/>
						<Pie data={usuariosTareas} dataKey="tareas">
							<LabelList
								dataKey="usuario"
								className="fill-background"
								stroke="none"
								fontSize={12}
								formatter={(value: keyof typeof chartConfig) =>
									chartConfig[value]?.label
								}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
