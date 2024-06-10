import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

function Upload() {
  const [uploadType, setUploadType] = useState('file');
  const [file, setFile] = useState(null);
  const [pictureUrl, setPictureUrl] = useState('');
  const [description, setDescription] = useState('');
  const [keyword, setKeyword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useContext(UserContext);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {

    setSuccessMessage('');
    setErrorMessage('');


    if (!keyword.trim()) {
      setErrorMessage('Keyword is required');
      return;
    }

    const formData = new FormData();
    formData.append('username', user.username);
    formData.append('description', description);
    formData.append('keyword', keyword);

    if (uploadType === 'file' && file) {
      formData.append('file', file);
    } else if (uploadType === 'url' && pictureUrl) {
      formData.append('picture_url', pictureUrl);
    }

    try {
      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.message) {
        setSuccessMessage('Upload successful');
        console.log(response.data.message);
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
    }
  };

  return (
    <div>
      <h2>Upload Picture</h2>
      <div>
        <label>
          <input
            type="radio"
            value="file"
            checked={uploadType === 'file'}
            onChange={() => setUploadType('file')}
          />
          Upload from PC
        </label>
        <label>
          <input
            type="radio"
            value="url"
            checked={uploadType === 'url'}
            onChange={() => setUploadType('url')}
          />
          Upload from URL
        </label>
      </div>
      {uploadType === 'file' && (
        <input type="file" onChange={handleFileChange} />
      )}
      {uploadType === 'url' && (
        <input
          type="text"
          placeholder="Picture URL"
          value={pictureUrl}
          onChange={(e) => setPictureUrl(e.target.value)}
        />
      )}
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="text"
        placeholder="Keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>} {/* Render success message */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Render error message */}
    </div>
  );
}

export default Upload;
