import { createClient } from "@/utils/supabase/server";

export async function deleteTarea(idTarea: string) {
	const supabase = await createClient();
	const { error } = await supabase.from("Tareas").delete().eq("id", idTarea);
	if (error) throw error;
}
