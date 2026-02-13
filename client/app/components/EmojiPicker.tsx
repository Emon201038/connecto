import React from "react";
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react";

interface IProps {
  onPick: (emoji: EmojiClickData) => void;
  style?: React.CSSProperties;
  open?: boolean;
}

const CustomEmojiPicker = ({ onPick, style, open = false }: IProps) => {
  return (
    <EmojiPicker
      onEmojiClick={onPick}
      emojiStyle={EmojiStyle.FACEBOOK}
      skinTonesDisabled
      lazyLoadEmojis
      style={style}
      open={open}
      onReactionClick={(e) => console.log(e)}
    />
  );
};

export default CustomEmojiPicker;
