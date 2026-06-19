import AutoLogoutTimer from "@/components/admin/AutoLogoutTimer";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AutoLogoutTimer />
      {children}
    </>
  );
}
