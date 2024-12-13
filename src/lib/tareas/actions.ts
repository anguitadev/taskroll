import { createClient } from "@/utils/supabase/client";

export async function deleteTarea(idTarea: string) {
	const supabase = createClient();
	const { error } = await supabase.from("Tareas").delete().eq("id", idTarea);
	if (error) throw error;
}
