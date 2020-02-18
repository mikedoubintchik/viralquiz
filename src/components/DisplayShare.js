import React from "react";
import { Card, Button } from "react-bootstrap";
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

const DisplayShare = ({ quizID, quizName }) => {
  const url = `${window.location.origin}/${quizID}`;

  return (
    <Card className="mb-4">
      <Card.Header className="text-center">Share Quiz</Card.Header>
      <Card.Body>
        <div className="share d-flex flex-wrap justify-content-between">
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

          <CopyToClipboard text={url}>
            <Button variant="primary" size="sm">
              Copy Quiz URL
            </Button>
          </CopyToClipboard>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DisplayShare;
