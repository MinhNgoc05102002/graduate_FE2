import { Container } from "@mui/material";
import { useState } from "react";
import WaitingRoom from "~/components/Test/WaitingRoom";
import {HubConnectionBuilder, LogLevel} from '@microsoft/signalr';

export default function Test() {
    const [conn, setConnection] = useState<any>();

    const joinChatRoom = async (username:string, chatRoom:string) => {
        try {
            // initiate connection
            const conn = (new HubConnectionBuilder())
                            .withUrl("https://localhost:7083/chat")
                            .configureLogging(LogLevel.Information)
                            .build();

            // set up handler
            conn.on("ReceiveMessage", (username, msg) => {
                console.log("msg: ", msg);                
            })

            await conn.start();
            await conn.invoke("JoinSpecialChatRoom", {username, chatRoom})

            setConnection(conn);
        } catch (err) {
            console.log(err);
        }
    }



    return (
        <div>
            <main>
                <Container>
                    <div className="row px-5 my-5">
                        <div className="col col-sm-12">
                            <h1>Welcome to F1 ChatApp</h1>
                        </div>
                    </div>
                    <WaitingRoom joinChatRoom={joinChatRoom}></WaitingRoom>
                </Container>
            </main>
        </div>
    )
};
