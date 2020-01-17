import React from "react";
import { Button } from "react-bootstrap";
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
import { CopyToClipboard } from "react-copy-to-clipboard";

const DisplayShare = props => {
  const url = `${window.location.origin}/${props.quizID}`;

  return (
    <div className="share d-flex mb-4 justify-content-between">
      <FacebookShareButton url={url} quote={props.quizName} className="p-2">
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <WhatsappShareButton
        url={url}
        title={props.quizName}
        separator=":: "
        className="p-2"
      >
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
      <TwitterShareButton url={url} title={props.quizName} className="p-2">
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <EmailShareButton
        url={url}
        subject={props.quizName}
        body="Take my quiz!"
        className="p-2"
      >
        <EmailIcon size={32} round />
      </EmailShareButton>

      <CopyToClipboard text={url}>
        <Button variant="primary" size="sm">
          Copy Quiz URL
        </Button>
      </CopyToClipboard>
    </div>
  );
};

export default DisplayShare;
