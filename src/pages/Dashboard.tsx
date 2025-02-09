import { Outlet } from "react-router"

export default function Dashboard({ userInfo }: { userInfo: any }) {

    return (
        <Outlet />
    )
}