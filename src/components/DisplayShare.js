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
import DisplayQuiz from "./quiz/DisplayQuiz";

const DisplayShare = (url, quizName) => {
  return (
    <div className="d-flex mb-4 w-50 justify-content-between">
      <FacebookShareButton url={url} quote={quizName} className="p-2">
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <WhatsappShareButton
        url={url}
        title={quizName}
        separator=":: "
        className="p-2"
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      <TwitterShareButton url={url} title={quizName} className="p-2">
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <EmailShareButton
        url={url}
        subject={quizName}
        body="Take my quiz!"
        className="p-2"
      >
        <EmailIcon size={32} round />
      </EmailShareButton>
    </div>
  );
};

export default DisplayShare;
