import { useParams } from "next/navigation";
import { useMemo } from "react";
const useConversation = () => {
    const params = useParams();

    // useMemo stores the value if it doesn't change it won't run and give the stored value
    const conversationId = useMemo(() => {
        if (!params?.conversationId) {
            return "";
        }
        return params.conversationId as string;
    }, [params?.conversationId]);

    // !! used to create it to boolean
    const isOpen = useMemo(() => !!conversationId, [conversationId]);

    return useMemo(
        () => ({
            isOpen,
            conversationId,
        }),
        [isOpen, conversationId]
    );
};

export default useConversation;
