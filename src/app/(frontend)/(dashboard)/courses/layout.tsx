import { AdminComponent } from "@/core/user/components/admin-component";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminComponent>
        {children}
    </AdminComponent>
    )
}