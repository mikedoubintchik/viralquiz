import React from "react";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon
} from "react-share";

const DisplayShare = props => {
  return (
    <div className="d-flex mb-4 w-50 justify-content-between">
      <FacebookShareButton
        url={props.url}
        quote={props.quizName}
        className="p-2"
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <WhatsappShareButton
        url={props.url}
        title={props.quizName}
        separator=":: "
        className="p-2"
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      <TwitterShareButton
        url={props.url}
        title={props.quizName}
        className="p-2"
      >
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <EmailShareButton
        url={props.url}
        subject={props.quizName}
        body="Take my quiz!"
        className="p-2"
      >
        <EmailIcon size={32} round />
      </EmailShareButton>
    </div>
  );
};

export default DisplayShare;
