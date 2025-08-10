import { AdminComponent } from "@/core/users/components/admin-component";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AdminComponent>
        {children}
    </AdminComponent>
    )
}