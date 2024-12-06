"use client";

import { LabelList, Pie, PieChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

type ChartConfig = {
	[key: string]: {
		label: string;
		color?: string; // optional color property
	};
};

const chartConfig: ChartConfig = {
	tareas: {
		label: "Tareas",
	},
} satisfies ChartConfig;

export function GraficoUsuarios({
	usuariosTareas,
}: {
	usuariosTareas: { usuario: string; tareas: number; fill: string }[];
}) {
	const topUsuariosTareas = usuariosTareas.sort((a, b) => b.tareas - a.tareas).slice(0, 5);

	topUsuariosTareas.forEach(({ usuario }) => {
		if (!chartConfig[usuario]) {
			chartConfig[usuario] = {
				label: usuario,
				color: `hsl(var(--chart-${Object.keys(chartConfig).length}))`,
			};
		}
	});

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
