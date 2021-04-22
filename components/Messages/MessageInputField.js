import React, { useState } from "react";
import { Segment, Form } from "semantic-ui-react";

function MessageInputField({ socket, user, messagesWith }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ position: "sticky", bottom: 0 }}>
      <Segment>
        <Form>
          <Form.Input
            size="large"
            placeholder="Send New Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            action={{
              color: "blue",
              icon: "telegram place",
              disabled: text === "",
              loading: loading,
            }}
          />
        </Form>
      </Segment>
    </div>
  );
}

export default MessageInputField;
