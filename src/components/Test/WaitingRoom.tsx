import { useState } from "react";

export default function WaitingRoom(props:any) {
    const {joinChatRoom} = props;
    const [username, setUsername] = useState<string>();
    const [chatroom, setChatroom] = useState<string>();

    return (
        <form action="" onSubmit={(e) => {
            e.preventDefault();
            joinChatRoom(username, chatroom);
        }}>
            <div className="row px-5 py-5">
                <div className="col-sm-12">
                    <input 
                        type="text"
                        placeholder="Username"
                        onChange={e => setUsername(e.target.value)} />
                     <input 
                        type="text"
                        placeholder="ChatRoom"
                        onChange={e => setChatroom(e.target.value)} />
                </div>

                <div className="col-sm-12">
                    <hr />
                    <button type="submit">Join</button>
                </div>
            </div>
        </form>
    )
};
