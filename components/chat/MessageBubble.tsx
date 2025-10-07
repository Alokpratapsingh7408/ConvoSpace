import { Message } from "@/types/chat";
import { formatTime } from "@/lib/utils";
import { FiCheck } from "react-icons/fi";
import { IoCheckmarkDone } from "react-icons/io5";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export default function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
  const statusIcon = {
    sent: <FiCheck className="w-4 h-4" />,
    delivered: <IoCheckmarkDone className="w-4 h-4" />,
    read: <IoCheckmarkDone className="w-4 h-4 text-[#53bdeb]" />,
  };

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} px-2 mb-1`}>
      <div
        className={`max-w-[65%] md:max-w-[45%] rounded-lg px-3 py-2 shadow-sm ${
          isOwnMessage
            ? "bg-[#005c4b] text-white rounded-tr-none"
            : "bg-[#202c33] text-white rounded-tl-none"
        }`}
      >
        <p className="text-[14.2px] leading-[19px] break-words whitespace-pre-wrap">{message.content}</p>
        <div
          className={`flex items-center gap-1 mt-1 justify-end ${
            isOwnMessage ? "text-gray-300" : "text-gray-400"
          }`}
        >
          <span className="text-[11px]">{formatTime(message.timestamp)}</span>
          {isOwnMessage && <span className="ml-1">{statusIcon[message.status]}</span>}
        </div>
      </div>
    </div>
  );
}
