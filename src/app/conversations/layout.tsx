import getConversations from "@/actions/getConversations";
import getUsers from "@/actions/getUsers";
import Sidebar from "@/components/SideBar";
import ConversationList from "@/components/ConversationList";
import AuthContext from "@/context/AuthContext";

export default async function ConversationsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const conversations = await getConversations();
    const users = await getUsers();

    // console.log(conversations);

    return (
        <AuthContext>
            <Sidebar>
                <div className="h-full relative">
                    <ConversationList
                        users={users}
                        initialItems={conversations}
                    />
                    {children}
                </div>
            </Sidebar>
        </AuthContext>
    );
}
