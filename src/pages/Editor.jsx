import React, { useRef, useState } from 'react';
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar
} from '@syncfusion/ej2-react-richtexteditor';

import { Header } from '../components';
import { useParams } from 'react-router-dom';

const Editor = () => {
  const editorRef = useRef(null);
  const [status, setStatus] = useState('');
  const [editorValue, setEditorValue] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { issueId } = useParams();
  const token = localStorage.getItem('access-token');

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmit = async () => {
    const content = editorRef.current?.getHtml();

    if (!status) {
      setErrorMessage('Please select a status before submitting.');
      return;
    }

    if (!content || content.trim() === '') {
      setErrorMessage('Editor content cannot be empty.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/feedbacks/new-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, content, issueId }),
      });

      if (response.status === 201) {
        setSuccessMessage('Request submitted successfully.');
        setErrorMessage('');
        setStatus('');
        setEditorValue('');
      } else {
        const result = await response.json();
        setErrorMessage(result.msg || 'Failed to submit request.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while submitting. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Feedback" />

      <div className="mb-4">
        <label htmlFor="status" className="block mb-2 font-semibold">Select Status</label>
        <select
          id="status"
          className="border border-gray-300 p-2 rounded-md w-full md:w-1/2"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">-- Select --</option>
          <option value="solved">Solved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <RichTextEditorComponent
        ref={editorRef}
        value={editorValue}
        change={(e) => setEditorValue(e.value)}
      >
        <div><h3>Type Here ...</h3></div>
        <Inject services={[HtmlEditor, Toolbar, Image, Link, QuickToolbar]} />
      </RichTextEditorComponent>

      {errorMessage && (
        <p className="text-red-600 mt-4 font-semibold">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-600 mt-4 font-semibold">{successMessage}</p>
      )}

      <button
        onClick={handleSubmit}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
      >
        Submit
      </button>
    </div>
  );
};

export default Editor;
