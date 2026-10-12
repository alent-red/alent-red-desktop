import * as React from 'react';

interface MessageInternalBubbleProps {
  text: string;
}

export const MessageInternalBubble = ({ text }: MessageInternalBubbleProps): React.ReactElement => (
  <div className="self-center text-[12px] italic text-muted px-3 py-1 max-w-[80%] text-center">
    {text}
  </div>
);
