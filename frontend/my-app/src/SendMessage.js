import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import './Messages.css';

function Messages() {
  const [messages, setMessages] = useState([]);
  const { user } = useContext(UserContext);
  const [replyContent, setReplyContent] = useState('');
  const [activeReplyIndex, setActiveReplyIndex] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/get_messages/${user.username}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [user.username]);

  const handleReplyChange = (content) => {
    setReplyContent(content);
  };

  const handleReply = async (index, recipient) => {
    const content = replyContent;
    if (!content.trim()) return;

    try {
      await axios.post('http://localhost:5000/reply_message', {
        original_message_index: index,
        recipient: recipient,
        content: content,
        sender: user.username,
      });

      setReplyContent('');
      setActiveReplyIndex(null);
      const response = await axios.get(`http://localhost:5000/get_messages/${user.username}`);
      setMessages(response.data);
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
    }
  };

  const handleDelete = async (index) => {
    try {
      await axios.post('http://localhost:5000/delete_message', {
        original_message_index: index,
      });

      const response = await axios.get(`http://localhost:5000/get_messages/${user.username}`);
      setMessages(response.data);
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
    }
  };

  const groupedMessages = messages.reduce((acc, message) => {
    const key = message.sender === user.username ? message.recipient : message.sender;
    if (!acc[key]) acc[key] = [];
    acc[key].push(message);
    return acc;
  }, {});

  return (
    <div>
      <h2>Your Messages</h2>
      <div className="messages-list">
        {Object.keys(groupedMessages).map((userKey, columnIndex) => (
          <div key={columnIndex} className="message-row">
            <h3>{userKey}</h3>
            {groupedMessages[userKey].map((message, index) => (
              <div key={index} className="message-item">
                <p>
                  <strong>{message.sender === user.username ? 'To:' : 'From:'}</strong>
                  {message.sender === user.username ? message.recipient : message.sender}
                  <button onClick={() => handleDelete(index)} style={{ marginLeft: '10px' }}>Delete</button>
                </p>
                <p>{message.content}</p>
                {message.replies.map((reply, replyIndex) => (
                  <div key={replyIndex} className="message-reply">
                    <p><strong>{reply.sender === user.username ? 'To:' : 'From:'}</strong> {reply.sender === user.username ? reply.recipient : reply.sender}</p>
                    <p>{reply.content}</p>
                  </div>
                ))}
                {activeReplyIndex === index ? (
                  <div>
                    <textarea
                      placeholder="Reply to this message"
                      value={replyContent}
                      onChange={(e) => handleReplyChange(e.target.value)}
                    />
                    <button onClick={() => handleReply(index, message.sender === user.username ? message.recipient : message.sender)}>Send Reply</button>
                    <button onClick={() => setActiveReplyIndex(null)}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => { setActiveReplyIndex(index); setReplyContent(''); }}>Reply</button>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
