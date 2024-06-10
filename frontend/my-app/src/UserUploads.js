import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import './UserUploads.css';

function UserUploads() {
  const [uploads, setUploads] = useState([]);
  const { user } = useContext(UserContext);
  const [editIndex, setEditIndex] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editKeyword, setEditKeyword] = useState('');
  const [messageContent, setMessageContent] = useState('');
  const [activeMessageIndex, setActiveMessageIndex] = useState(null);

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const response = await axios.get('http://localhost:5000/uploads');
        setUploads(response.data);
      } catch (error) {
        console.error('Error fetching uploads:', error);
      }
    };

    fetchUploads();
  }, []);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditDescription(uploads[index].description);
    setEditKeyword(uploads[index].keyword);
  };

  const handleSave = async (index) => {
    const upload = uploads[index];
    try {
      await axios.post('http://localhost:5000/modify_picture', {
        filename: upload.filename,
        description: editDescription,
        keyword: editKeyword,
        username: user.username,
      });
      const updatedUploads = [...uploads];
      updatedUploads[index].description = editDescription;
      updatedUploads[index].keyword = editKeyword;
      setUploads(updatedUploads);
      setEditIndex(null);
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
    }
  };

  const handleCancel = () => {
    setEditIndex(null);
  };

  const handleMessageSend = async (index) => {
    const upload = uploads[index];
    try {
      await axios.post('http://localhost:5000/send_message', {
        recipient: upload.username,
        content: messageContent,
        sender: user.username,
      });
      setMessageContent('');
      setActiveMessageIndex(null);
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
    }
  };

  return (
    <div>
      <h2>All Uploads</h2>
      <div className="uploads-grid">
        {uploads.map((upload, index) => (
          <div key={index} className="upload-item">
            <img src={upload.file_url || `http://localhost:5000/uploads/files/${upload.filename}`} alt={upload.description} width="100" />
            <p><strong>Uploaded by:</strong> {upload.username}</p>
            {user.username === upload.username ? (
              editIndex === index ? (
                <div>
                  <input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    value={editKeyword}
                    onChange={(e) => setEditKeyword(e.target.value)}
                    placeholder="Keyword"
                  />
                  <button onClick={() => handleSave(index)}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>{upload.description}</p>
                  <p><strong>Keyword:</strong> {upload.keyword}</p>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                </div>
              )
            ) : (
              <div>
                <p>{upload.description}</p>
                <p><strong>Keyword:</strong> {upload.keyword}</p>
                {activeMessageIndex === index ? (
                  <div>
                    <textarea
                      placeholder="Write a message"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                    />
                    <button onClick={() => handleMessageSend(index)}>Send Message</button>
                    <button onClick={() => setActiveMessageIndex(null)}>Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setActiveMessageIndex(index)}>Send Message</button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserUploads;
