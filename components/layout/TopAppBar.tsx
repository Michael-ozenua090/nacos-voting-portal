import { createClient } from "@/utils/supabase/server";
import TopAppBarClient from "./TopAppBarClient";

export default async function TopAppBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const isAdmin = !!user;
  const isSuperAdmin = user?.email === process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

  return <TopAppBarClient isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} />;
}
