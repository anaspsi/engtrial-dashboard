
import '../home.css'
import { Container } from "react-bootstrap"

interface UserInfo {
    name: string;
}

interface HomeProps {
    userInfo: UserInfo;
}

export default function Home({ userInfo }: HomeProps) {
    return (
        <Container fluid>
            {
                userInfo.name.includes('init') ? userInfo.name : <h1>Welcome 🤝</h1>
            }
        </Container>
    )
}